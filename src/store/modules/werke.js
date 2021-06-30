import {
  existsSync,
  lstatSync,
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
  GATHER_WERKE,
  SET_GATHERING_WERKE_PROGRESS,
  SET_GATHERING_WERKE,
} from '../types';

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
    hotWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_HOT);
    },
    coldWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_COLD);
    },
    archivedWerke(state) {
      return state.werke.filter((werk) => werk.state === WERK_STATE_ARCHIVED);
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
    [GATHER_WERKE]({ dispatch, getters }, dir) {
      return new Promise((resolve, reject) => {
        try {
          dispatch(SET_GATHERING_WERKE, true);
          dispatch(SET_GATHERING_WERKE_PROGRESS, {
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

            dispatch(SET_GATHERING_WERKE_PROGRESS, {
              cur: i + 1,
              total: werkDirs.length,
              item: `Searching in ${werkDir}`,
            });

            const werkFile = join(werkDir, WERK_DIR_NAME, WERK_FILE_NAME);
            // skip if dir has no werk file
            if (!existsSync(werkFile)) {
              continue;
            }
            const werk = JSON.parse(readFileSync(werkFile, { encoding: 'utf8' }));
            result.push(dispatch(ADD_WERK, werk));
          }

          resolve(Promise.all(result));
        } catch (ex) {
          dispatch(SET_GATHERING_WERKE, false);
          reject(ex);
        } finally {
          dispatch(SET_GATHERING_WERKE, false);
        }
      });
    },
    [ADD_WERK]({ commit, getters }, werk) {
      const index = getters.werke.findIndex((w) => w.id === werk.id);
      if (index === -1) {
        commit(ADD_WERK, werk);
      } else {
        commit(SET_WERK, { index, werk });
      }
    },
  },
};
