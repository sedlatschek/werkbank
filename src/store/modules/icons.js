import Vue from 'vue';
import { SET_ICON, REMOVE_ICON } from '@/store/types';

export default {
  state: {
    icons: {},
  },
  getters: {
    icon: (state) => (idOrHandle) => state.icons[idOrHandle],
  },
  mutations: {
    [SET_ICON](state, { id, icon }) {
      Vue.set(state.icons, id, icon);
    },
    [REMOVE_ICON](state, id) {
      Vue.delete(state.icons, id);
    },
  },
  actions: {
    [SET_ICON]({ commit }, data) {
      commit(SET_ICON, data);
    },
    [REMOVE_ICON]({ commit }, id) {
      commit(REMOVE_ICON, id);
    },
  },
};
