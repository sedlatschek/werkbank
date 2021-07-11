import { join } from 'path';
import Vue from 'vue';
import { DIR_ENV_ICONS, PNG_MIME } from '@/config';
import {
  BOOTSTRAP_ENVIRONMENTS,
  SET_ENVIRONMENT,
  REMOVE_ENVIRONMENT,
  GATHER_ENVIRONMENTS,
  SET_ICON,
} from '@/store/types';
import { pathExists } from 'fs-extra';
import { loadBase64 } from '@/util';

const defaults = [{
  handle: 'audio',
  name: 'Audio',
  dir: 'Audio',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'cpp',
  name: 'C++',
  dir: 'code\\cpp',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'csharp',
  name: 'C#',
  dir: 'code\\csharp',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'delphi7',
  name: 'Delphi 7',
  dir: 'code\\delphi\\7',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'delphi10',
  name: 'Delphi 10',
  dir: 'code\\delphi\\10',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'docker',
  name: 'Docker',
  dir: 'code\\docker',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'Java',
  name: 'java',
  dir: 'code\\java',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'js',
  name: 'JavaScript',
  dir: 'code\\web',
  ignore: [
    'bower_components',
    'node_modules',
  ],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'md',
  name: 'Markdown',
  dir: 'code\\md',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'ps',
  name: 'Photoshop',
  dir: 'Bild',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'php',
  name: 'PHP',
  dir: 'code\\web',
  ignore: [
    'bower_components',
    'node_modules',
    'vendor',
  ],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'picture',
  name: 'Picture',
  dir: 'Bild',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'premiere',
  name: 'Premiere',
  dir: 'Video',
  ignore: [],
  preset: {
    compressOnArchive: false,
  },
},
{
  handle: 'python',
  name: 'Python',
  dir: 'code\\python',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'tf',
  name: 'Terraform',
  dir: 'code\\terraform',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'uml',
  name: 'UML',
  dir: 'uml',
  ignore: [],
  preset: {
    compressOnArchive: true,
  },
},
{
  handle: 'vegas',
  name: 'Vegas',
  dir: 'Video',
  ignore: [],
  preset: {
    compressOnArchive: false,
  },
},
{
  handle: 'wmm',
  name: 'Windows Movie Maker',
  dir: 'Video',
  ignore: [],
  preset: {
    compressOnArchive: false,
  },
}];

export default {
  state: {
    environments: [],
  },
  getters: {
    environments(state) {
      return state.environments;
    },
    envByHandle: (state) => (handle) => state.environments.find((env) => env.handle === handle),
    envIconFile: () => (handle) => `${join(DIR_ENV_ICONS, handle)}.png`,
  },
  mutations: {
    [SET_ENVIRONMENT](state, environment) {
      const index = state.environments.findIndex((env) => env.handle === environment.handle);
      if (index === -1) {
        state.environments.push(environment);
      } else {
        Vue.set(state.environments, index, environment);
      }
    },
    [REMOVE_ENVIRONMENT](state, handle) {
      const index = state.environments.findIndex((env) => env.handle === handle);
      if (index !== -1) {
        state.environments.splice(index, 1);
      }
    },
  },
  actions: {
    async [BOOTSTRAP_ENVIRONMENTS]({ commit, dispatch, getters }) {
      if (getters.environments.length === 0) {
        // only store defaults when environments are still empty
        defaults.forEach((env) => commit(SET_ENVIRONMENT, env));
      }
      await dispatch(GATHER_ENVIRONMENTS);
    },
    async [GATHER_ENVIRONMENTS]({ dispatch, getters }) {
      getters.environments.forEach(async (env) => {
        const iconFile = getters.envIconFile(env.handle);
        if (await pathExists(iconFile)) {
          const icon = await loadBase64(iconFile, PNG_MIME);
          await dispatch(SET_ICON, { id: env.handle, icon });
        }
      });
    },
    [SET_ENVIRONMENT]({ commit }, environment) {
      commit(SET_ENVIRONMENT, environment);
    },
    [REMOVE_ENVIRONMENT]({ commit }, handle) {
      commit(REMOVE_ENVIRONMENT, handle);
    },
  },
};
