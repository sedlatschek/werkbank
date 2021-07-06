import { ADD_ICON } from '@/store/types';
import Vue from 'vue';

export default {
  state: {
    icons: {},
  },
  getters: {
    icon: (state) => (idOrHandle) => state.icons[idOrHandle],
  },
  mutations: {
    [ADD_ICON](state, { id, icon }) {
      Vue.set(state.icons, id, icon);
    },
  },
  actions: {
    [ADD_ICON]({ commit }, data) {
      commit(ADD_ICON, data);
    },
  },
};
