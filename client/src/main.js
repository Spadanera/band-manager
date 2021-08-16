import 'babel-polyfill';
import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import NProgress from 'vue-nprogress';
import router from './router';
import moment from 'moment';
import VuetifyConfirm from 'vuetify-confirm';
import TextHighlight from 'vue-text-highlight';
import CKEditor from '@ckeditor/ckeditor5-vue';
import VueSessionStorage from 'vue-sessionstorage';
import RestService from './services/rest-services';
import 'vuetify/dist/vuetify.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import MusicGenres from 'musicgenres-json'
import gmapsKey from './gmapsKey';
import client from "./services/client";
import './ml';

const options = {
  latencyThreshold: 100, // Number of ms before progressbar starts showing, default: 100,
  router: false, // Show progressbar when navigating routes, default: true
  http: false // Show progressbar when doing Vue.http, default: true
};
Vue.use(NProgress, options);
Vue.use(CKEditor);
Vue.use(VueSessionStorage);
Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Accept',
  buttonFalseText: 'Discard',
  color: 'primary',
  icon: 'warning',
  title: 'Warning',
  width: 350,
  property: '$confirm',
  vuetify
});
Vue.component('text-highlight', TextHighlight);

Vue.use(VueGoogleMaps, {
  load: {
    key: gmapsKey.apiKey,
    libraries: 'places,drawing,visualization', // This is required if you use the Autocomplete plugin
    language: 'en'
  },
  installComponents: true
})

Vue.config.productionTip = false;
let locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale);
Vue.prototype.moment = moment;

Vue.prototype.copy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

Vue.prototype.parseTime =(second) => {
  return `${Math.floor(second / 60)}:${("00" + (second % 60)).slice(-2)}`;
};

Vue.prototype.Service = RestService;

Vue.prototype.Genres = new MusicGenres().genres;

const nprogress = new NProgress({ showSpinner: false });

new Vue({
  vuetify,
  router,
  nprogress,
  data() {
    return {
      // put here the enum
    };
  },
  created() {
    let requestCount = 0;
    client.interceptors.request.use(config => {
      if (!/autoreload/.test(config.url)) {
        if (requestCount === 0) {
          nprogress.start();
        }
        requestCount++;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
    client.interceptors.response.use(response => {
      requestCount--;
      if (requestCount === 0) {
        setTimeout(() => {
          nprogress.done();
        }, 500);
      }
      return response;
    }, error => {
      requestCount--;
      if (requestCount === 0) {
        setTimeout(() => {
          nprogress.done();
        }, 500);
      }
      if (error.response.status === 401) {
        router.push({ name: "home", params: { message: 'Session expired' } });
      }
      return Promise.reject(error);
    });
  },
  render: h => h(App)
}).$mount('#app');
