import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import 'vuetify/dist/vuetify.min.css'
import { Touch } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  directives: {
    Touch
  }
});

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.indigo.darken4,
        secondary: colors.indigo.darken3
      }
    }
  }
});