import {
  ensureDir,
  existsSync,
  lstatSync,
  outputJson,
  readdirSync,
  readFileSync,
} from 'fs-extra';
import { join } from 'path';
import Vue from 'vue';
import { WERK_DIR_NAME, WERK_FILE_NAME } from '@/config';
import {
  BOOTSTRAP_WERKE,
  WERK_STATE_HOT,
  WERK_STATE_ARCHIVED,
  WERK_STATE_COLD,
  ADD_WERK,
  SET_WERK,
  SAVE_WERK,
  GATHER_WERKE,
  SET_GATHERING_WERKE_PROGRESS,
  SET_GATHERING_WERKE,
  RELOAD_WERK,
  WERK_STATE,
} from '../types';
import { hideDir } from '../../util';

function deserialize(werkFile) {
  const werk = JSON.parse(readFileSync(werkFile, { encoding: 'utf8' }));
  werk.created = new Date(werk.created);
  for (let i = 0; i < werk.history.length; i += 1) {
    werk.history[i].ts = new Date(werk.history[i].ts);
  }
  return werk;
}

export default {
  state: {
    gatheringWerke: false,
    gatheringWerkeProgress: {
      cur: 0,
      total: 0,
      item: null,
    },
    werke: [],
  },
  getters: {
    werke(state) {
      return state.werke;
    },
    werkById: (state) => (id) => state.werke.find((werk) => werk.id === id),
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
    gatheringWerkeProgress(state) {
      return state.gatheringWerkeProgress;
    },
    dirFor: (state, getters) => (werk, werkState = null) => {
      const desiredState = (werkState == null) ? werk.state : werkState;
      const env = getters.environmentByHandle(werk.env);
      const baseDir = getters.setting_dir(desiredState);
      return join(env.dir.replace(/<base>/, baseDir), werk.name);
    },
  },
  mutations: {
    [ADD_WERK](state, werk) {
      state.werke.push(werk);
    },
    [SET_WERK](state, { index, werk }) {
      Vue.set(state.werke, index, werk);
    },
    [SET_GATHERING_WERKE](state, value) {
      Vue.set(state, 'gatheringWerke', !!value);
    },
    [SET_GATHERING_WERKE_PROGRESS](state, progress) {
      Vue.set(state, 'gatheringWerkeProgress', progress);
    },
  },
  actions: {
    [BOOTSTRAP_WERKE]({ dispatch, getters }) {
      if (getters.settings.gatherOnStartup) {
        return Promise.all([
          dispatch(GATHER_WERKE, getters.setting_dir_hot),
          dispatch(GATHER_WERKE, getters.setting_dir_cold),
          dispatch(GATHER_WERKE, getters.setting_dir_archive),
        ]);
      }
      return false;
    },
    [GATHER_WERKE]({ commit, dispatch, getters }, dir) {
      console.log(`Gather werke in ${dir}`);
      return new Promise((resolve, reject) => {
        try {
          commit(SET_GATHERING_WERKE, true);
          commit(SET_GATHERING_WERKE_PROGRESS, {
            cur: 0,
            total: 1,
            item: 'Gathering directories...',
          });

          let werkDirs = [];
          const directories = [...new Set(getters.environments.map((e) => e.dir))];

          for (let i = 0; i < directories.length; i += 1) {
            const envDir = directories[i].replace(/<base>/, dir);
            // skip if path does not exist
            if (!existsSync(envDir)) {
              continue;
            }
            // skip if path is not directory
            const dirStats = lstatSync(envDir);
            if (!dirStats.isDirectory()) {
              continue;
            }
            werkDirs = werkDirs.concat((readdirSync(envDir)).map((name) => join(envDir, name)));
          }

          const result = [];
          for (let i = 0; i < werkDirs.length; i += 1) {
            const werkDir = werkDirs[i];

            commit(SET_GATHERING_WERKE_PROGRESS, {
              cur: i + 1,
              total: werkDirs.length,
              item: `Searching in ${werkDir}`,
            });

            const werkFile = join(werkDir, WERK_DIR_NAME, WERK_FILE_NAME);
            // skip if dir has no werk file
            if (!existsSync(werkFile)) {
              continue;
            }
            const werk = deserialize(werkFile);
            result.push(dispatch(SET_WERK, werk));
          }

          resolve(Promise.all(result));
        } catch (ex) {
          commit(SET_GATHERING_WERKE, false);
          reject(ex);
        } finally {
          commit(SET_GATHERING_WERKE, false);
        }
      });
    },
    [SET_WERK]({ commit, getters }, werk) {
      const index = getters.werke.findIndex((w) => w.id === werk.id);
      if (index === -1) {
        commit(ADD_WERK, werk);
      } else {
        commit(SET_WERK, { index, werk });
      }
    },
    [RELOAD_WERK]({ dispatch, getters }, id) {
      const werk = getters.werkById(id);
      if (werk) {
        Object.keys(WERK_STATE).forEach((werkState) => {
          const dir = getters.dirFor(werk, werkState);
          const werkFile = join(dir, WERK_DIR_NAME, WERK_FILE_NAME);
          if (existsSync(werkFile)) {
            const reloadedWerk = deserialize(werkFile);
            return dispatch(SET_WERK, reloadedWerk);
          }
          return false;
        });
      }
      return false;
    },
    async [SAVE_WERK]({ getters }, werk) {
      const dir = getters.dirFor(werk);
      const werkDir = join(dir, WERK_DIR_NAME);
      await ensureDir(werkDir);
      await hideDir(werkDir);
      const werkFile = join(werkDir, WERK_FILE_NAME);
      return outputJson(werkFile, werk);
    },
  },
};
