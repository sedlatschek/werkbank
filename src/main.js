import Vue from 'vue';
import { ensureDir } from 'fs-extra';
import { DIR_APPDATA } from '@/config';
import { BOOTSTRAP } from '@/store/types';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

(async () => {
  await ensureDir(DIR_APPDATA);
  await store.dispatch(BOOTSTRAP);
  window.app = new Vue({
    store,
    vuetify,
    render(h) { return h(App); },
  }).$mount('#app');
})();
