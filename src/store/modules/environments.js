import { environments as defaultEnvironments } from '@/defaults.json';
import { BOOTSTRAP_ENVIRONMENTS, ADD_ENVIRONMENTS, CLEAR_ENVIRONMENTS } from '@/store/types';

export default {
  state: {
    environments: [],
  },
  getters: {
    environments(state) {
      return state.environments;
    },
  },
  mutations: {
    [ADD_ENVIRONMENTS](state, environments) {
      state.environments = state.environments.concat(environments);
    },
    [CLEAR_ENVIRONMENTS](state) {
      state.environments = [];
    },
  },
  actions: {
    [BOOTSTRAP_ENVIRONMENTS]({ dispatch, getters }) {
      if (getters.environments.length === 0) {
        dispatch(ADD_ENVIRONMENTS, defaultEnvironments);
      }
    },
    [ADD_ENVIRONMENTS]({ commit }, environments) {
      commit(ADD_ENVIRONMENTS, environments);
    },
    [CLEAR_ENVIRONMENTS]({ commit }) {
      commit(CLEAR_ENVIRONMENTS);
    },
  },
};
