import Vue from 'vue';
import { SET_SETTING } from '../types';

export default {
  state: {
    settings: {
      directories: {
        hot: 'hot',
        cold: 'cold',
        archive: 'archive',
      },
      gatherOnStartup: true,
    },
  },
  getters: {
    settings(state) {
      return state.settings;
    },
    setting_dir_hot(state) {
      return state.settings.directories.hot;
    },
    setting_dir_cold(state) {
      return state.settings.directories.cold;
    },
    setting_dir_archive(state) {
      return state.settings.directories.archive;
    },
  },
  mutations: {
    [SET_SETTING](state, { key, value }) {
      Vue.set(state.settings, key, value);
    },
  },
  actions: {
    [SET_SETTING]({ commit }, keyValue) {
      commit(SET_SETTING, keyValue);
    },
  },
};
