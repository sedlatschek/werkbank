import { exec } from 'child_process';
import {
  ensureDir,
  lstat,
  outputJson,
  pathExists,
  readdir,
  readFile,
  writeFile,
} from 'fs-extra';
import { join } from 'path';
import Vue from 'vue';
import {
  WERK_DIR_NAME,
  WERK_FILE_NAME,
  WERK_ICON_MIME,
  WERK_ICON_NAME,
} from '@/config';
import {
  ADD_ICON,
  BOOTSTRAP_WERKE,
  WERK_STATE_HOT,
  WERK_STATE_ARCHIVED,
  WERK_STATE_COLD,
  ADD_WERK,
  SET_WERK,
  SET_WERK_MOVING,
  SAVE_WERK,
  GATHER_ALL_WERKE,
  GATHER_WERKE,
  SET_GATHERING_WERKE,
  RELOAD_WERK,
  LOAD_WERK_IN,
  REMOVE_WERK,
  WERK_STATE,
  OPEN_WERK_FOLDER,
  PARSE_DIR,
  PARSE_DIRS,
} from '@/store/types';
import { hideDir } from '@/util';

class WerkFileMissingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WerkFileMissingError';
  }
}

async function deserialize(werkFile) {
  const werk = JSON.parse(await readFile(werkFile, { encoding: 'utf8' }));
  werk.created = new Date(werk.created);
  for (let i = 0; i < werk.history.length; i += 1) {
    werk.history[i].ts = new Date(werk.history[i].ts);
  }
  return werk;
}

export default {
  state: {
    gatheringWerke: false,
    werke: [],
  },
  getters: {
    werke(state) {
      return state.werke;
    },
    werkById: (state) => (id) => state.werke.find((werk) => werk.id === id),
    werkByName: (state) => (name) => state.werke.find((werk) => werk.name === name),
    werkeByEnv: (state) => (env) => state.werke.filter((werk) => werk.env === env),
    hotWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_HOT);
    },
    coldWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_COLD);
    },
    archivedWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_ARCHIVED);
    },
    gatheringWerke(state) {
      return state.gatheringWerke;
    },
    dirFor: (state, getters) => (werk, werkState = null) => {
      const desiredState = (werkState == null) ? werk.state : werkState;
      const env = getters.envByHandle(werk.env);
      const baseDir = getters.setting_dir(desiredState);
      return join(baseDir, env.dir, werk.name);
    },
  },
  mutations: {
    [ADD_WERK](state, werk) {
      state.werke.push(werk);
    },
    [SET_WERK](state, { index, werk }) {
      Vue.set(state.werke, index, werk);
    },
    [SET_WERK_MOVING](state, { id, value }) {
      const index = state.werke.findIndex((w) => w.id === id);
      if (index !== -1) {
        Vue.set(state.werke[index], 'moving', value);
      }
    },
    [REMOVE_WERK](state, id) {
      const index = state.werke.findIndex((w) => w.id === id);
      if (index !== -1) {
        state.werke.splice(index, 1);
      }
    },
    [SET_GATHERING_WERKE](state, value) {
      Vue.set(state, 'gatheringWerke', value);
    },
  },
  actions: {
    [BOOTSTRAP_WERKE]({ dispatch, getters }) {
      if (getters.settings.gatherOnStartup) {
        dispatch(GATHER_ALL_WERKE);
      }
    },
    [GATHER_ALL_WERKE]({ commit, dispatch, getters }) {
      commit(SET_GATHERING_WERKE, true);
      Promise.all([
        dispatch(GATHER_WERKE, getters.setting_dir_hot),
        dispatch(GATHER_WERKE, getters.setting_dir_cold),
        dispatch(GATHER_WERKE, getters.setting_dir_archive),
      ]).finally(() => {
        commit(SET_GATHERING_WERKE, false);
      });
    },
    async [GATHER_WERKE]({ dispatch, getters }, dir) {
      console.log(GATHER_WERKE, dir);
      if (!dir) {
        throw new Error('Directory is not specified');
      }
      if (!await pathExists(dir)) {
        throw new Error(`${dir} does not exist`);
      }
      const directories = [...new Set(getters.environments.map((e) => e.dir))];
      const promises = [];
      directories.forEach(async (directory) => {
        promises.push(dispatch(PARSE_DIRS, join(dir, directory)));
      });
      await Promise.all(promises);
    },
    async [PARSE_DIRS]({ dispatch }, directory) {
      // skip if path does not exist
      if (!await pathExists(directory)) return;

      // skip if path is not a directory
      const dirStats = await lstat(directory);
      if (!dirStats.isDirectory()) return;

      const subDirs = (await readdir(directory)).map((name) => join(directory, name));
      const promises = [];
      subDirs.forEach((subDir) => {
        promises.push(dispatch(PARSE_DIR, subDir));
      });
      await Promise.all(promises);
    },
    async [PARSE_DIR]({ dispatch }, dir) {
      console.log(PARSE_DIR, dir);
      const werkFile = join(dir, WERK_DIR_NAME, WERK_FILE_NAME);

      // skip if dir has no werk file
      if (!await pathExists(werkFile)) return;

      const werk = await deserialize(werkFile);

      // load icon file
      const iconFile = join(dir, WERK_DIR_NAME, WERK_ICON_NAME);
      if (await pathExists(iconFile)) {
        const icon = `${WERK_ICON_MIME}${(await readFile(iconFile)).toString('base64')}`;
        dispatch(ADD_ICON, { id: werk.id, icon });
      }

      await dispatch(SET_WERK, werk);
    },
    [SET_WERK]({ commit, getters }, werk) {
      const index = getters.werke.findIndex((w) => w.id === werk.id);
      if (index === -1) {
        commit(ADD_WERK, werk);
      } else {
        commit(SET_WERK, { index, werk });
      }
    },
    [RELOAD_WERK]({ commit, dispatch, getters }, id) {
      console.log(RELOAD_WERK, id);
      const werk = getters.werkById(id);
      if (werk) {
        const promises = [];
        Object.keys(WERK_STATE).forEach((werkState) => {
          promises.push(dispatch(LOAD_WERK_IN, { werk, werkState }));
        });
        Promise.any(promises).then((reloadedWerk) => {
          dispatch(SET_WERK, reloadedWerk);
        }).catch((error) => {
          if (error.errors && error.errors.every((e) => e instanceof WerkFileMissingError)) {
            // remove werk if it does not exist in any folder
            commit(REMOVE_WERK, id);
          }
        });
      }
    },
    [LOAD_WERK_IN]({ getters }, { werk, werkState }) {
      console.log(LOAD_WERK_IN, werkState);
      return new Promise((resolve, reject) => {
        const dir = getters.dirFor(werk, werkState);
        const werkFile = join(dir, WERK_DIR_NAME, WERK_FILE_NAME);
        pathExists(werkFile).then((exists) => {
          if (!exists) reject(new WerkFileMissingError('Werkfile does not exist'));
          deserialize(werkFile).then(resolve).catch(reject);
        });
      });
    },
    async [SAVE_WERK]({ getters }, werk) {
      const dir = getters.dirFor(werk);
      const werkDir = join(dir, WERK_DIR_NAME);
      await ensureDir(werkDir);
      await hideDir(werkDir);
      const werkFile = join(werkDir, WERK_FILE_NAME);

      const icon = getters.icon(werk.id);
      if (icon) {
        const iconFile = join(werkDir, WERK_ICON_NAME);
        const base64 = icon.substr(-1 * (icon.length - WERK_ICON_MIME.length));
        await writeFile(iconFile, base64, 'base64');
      }

      return outputJson(werkFile, werk);
    },
    [OPEN_WERK_FOLDER]({ getters }, werk) {
      const dir = getters.dirFor(werk);
      exec(`start "" "${dir}"`);
    },
  },
};
