import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';
import store from '../store';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: store.getters.setting_dark,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: colors.teal.lighten1,
        secondary: colors.blueGrey.lighten4,
        accent: colors.lightBlue.darken3,
        error: colors.red.darken2,
        info: colors.cyan.lighten3,
        success: colors.green.lighten1,
        warning: colors.yellow.lighten1,
      },
      light: {
        primary: colors.teal.lighten1,
        secondary: colors.blueGrey.lighten4,
        accent: colors.lightBlue.darken3,
        error: colors.red.darken2,
        info: colors.cyan.lighten3,
        success: colors.green.lighten1,
        warning: colors.yellow.lighten1,
      },
    },
  },
});
