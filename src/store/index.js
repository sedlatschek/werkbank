import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-electron-store';
import { FILE_STATE } from '@/config';
import ModuleApp from './modules/app';
import ModuleSettings from './modules/settings';
import ModuleIcons from './modules/icons';
import ModuleEnvironments from './modules/environments';
import ModuleWerke from './modules/werke';
import ModuleQueue from './modules/queue';
import {
  BOOTSTRAP,
  BOOTSTRAP_APP,
  BOOTSTRAP_ENVIRONMENTS,
  BOOTSTRAP_QUEUE,
  BOOTSTRAP_WERKE,
} from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    PersistedState.create({
      dev: process.env.NODE_ENV !== 'production',
      fileName: FILE_STATE.replace(/.json$/, ''),
      paths: [
        'ModuleApp',
        'ModuleEnvironments',
        'ModuleQueue.queue',
        'ModuleSettings',
      ],
    }),
  ],
  actions: {
    async [BOOTSTRAP]({ dispatch }) {
      await dispatch(BOOTSTRAP_APP);
      await dispatch(BOOTSTRAP_QUEUE);
      await dispatch(BOOTSTRAP_ENVIRONMENTS);
      await dispatch(BOOTSTRAP_WERKE);
    },
  },
  modules: {
    ModuleApp,
    ModuleSettings,
    ModuleIcons,
    ModuleEnvironments,
    ModuleWerke,
    ModuleQueue,
  },
});
