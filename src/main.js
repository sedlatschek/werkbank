import Vue from 'vue';
import { autoUpdater } from 'electron-updater';
import { BOOTSTRAP } from '@/store/types';
import App from './App.vue';
import init from './init';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

(async () => {
  await init();
  window.app = new Vue({
    store,
    vuetify,
    render(h) { return h(App); },
  }).$mount('#app');
  store.dispatch(BOOTSTRAP);
  autoUpdater.checkForUpdatesAndNotify();
})();
