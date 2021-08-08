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
    themes: {
      light: {
        primary: colors.red.darken4,
        secondary: '#b0bec5',
        accent: '#FFFAFA',
        error: '#b71c1c',
        background: '#FFFFFF'
      },
      dark: {
        primary: colors.red.darken4,
        background: '#424242'
      }
    }
  }
});