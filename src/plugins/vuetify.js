import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'
import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
      locales: {
          es
      },
      current: 'es'
  },
  theme: {
    themes: {
      light: {
        primary: colors.lightBlue,
        secondary: colors.lightBlue.darken1,
        accent: colors.lightBlue.accent
      }
    }
  }
});
