import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
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
