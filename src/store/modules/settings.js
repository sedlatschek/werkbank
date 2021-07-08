import { ipcRenderer } from 'electron';
import Vue from 'vue';
import { SET_SETTING } from '../types';

// main settings are also passed as an event to be processed in the main thread
const mainSettings = [
  'launchWithSystem',
];

export default {
  state: {
    settings: {
      dir_hot: null,
      dir_cold: null,
      dir_archive: null,
      gatherOnStartup: true,
      launchWithSystem: false,
    },
  },
  getters: {
    settings(state) {
      return state.settings;
    },
    setting_dir_hot(state) {
      return state.settings.dir_hot;
    },
    setting_dir_cold(state) {
      return state.settings.dir_cold;
    },
    setting_dir_archive(state) {
      return state.settings.dir_archive;
    },
    setting_dirs(state) {
      return [
        state.settings.dir_hot,
        state.settings.dir_cold,
        state.settings.dir_archive,
      ];
    },
    setting_dir: (state, getters) => (werkState) => getters.setting_dirs[werkState],
  },
  mutations: {
    [SET_SETTING](state, { key, value }) {
      Vue.set(state.settings, key, value);
    },
  },
  actions: {
    [SET_SETTING]({ commit }, keyValue) {
      if (mainSettings.includes(keyValue.key)) {
        ipcRenderer.send('setting-changed', keyValue);
      }
      commit(SET_SETTING, keyValue);
    },
  },
};
