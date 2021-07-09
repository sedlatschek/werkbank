import Vue from 'vue';
import {
  BOOTSTRAP_APP,
  SET_LAST_USED_VERSION,
  SET_OPEN_WITH_CHANGELOG,
} from '../types';
import { version } from '../../../package.json';

export default {
  state: {
    lastUsedVersion: null,
    openWithChangelog: false,
  },
  getters: {
    busy(state, getters) {
      return getters.gatheringWerke;
    },
    lastUsedVersion(state) {
      return state.lastUsedVersion;
    },
    openWithChangelog(state) {
      return state.openWithChangelog;
    },
  },
  mutations: {
    [SET_LAST_USED_VERSION](state, newVersion) {
      Vue.set(state, 'lastUsedVersion', newVersion);
    },
    [SET_OPEN_WITH_CHANGELOG](state, value) {
      Vue.set(state, 'openWithChangelog', value);
    },
  },
  actions: {
    [BOOTSTRAP_APP]({ dispatch }) {
      dispatch(SET_LAST_USED_VERSION, version);
    },
    [SET_LAST_USED_VERSION]({ commit, getters }, newVersion) {
      if (getters.lastUsedVersion !== newVersion) {
        commit(SET_LAST_USED_VERSION, newVersion);
        commit(SET_OPEN_WITH_CHANGELOG, true);
      }
    },
  },
};
