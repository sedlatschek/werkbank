import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-electron-store';
import { FILE_STATE } from '@/config';
import ModuleSettings from './modules/settings';
import ModuleEnvironments from './modules/environments';
import ModuleWerke from './modules/werke';
import { BOOTSTRAP, BOOTSTRAP_ENVIRONMENTS, BOOTSTRAP_WERKE } from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    PersistedState.create({
      dev: process.env.NODE_ENV !== 'production',
      fileName: FILE_STATE.replace(/.json$/, ''),
    }),
  ],
  actions: {
    [BOOTSTRAP]({ dispatch }) {
      return Promise.all([
        dispatch(BOOTSTRAP_ENVIRONMENTS),
        dispatch(BOOTSTRAP_WERKE),
      ]);
    },
  },
  modules: {
    ModuleSettings,
    ModuleEnvironments,
    ModuleWerke,
  },
});
