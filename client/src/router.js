import Vue from 'vue';
import Router from 'vue-router';
// import RestService from './services/rest/rest-services';

// Component
import Layout from './views/Layout.vue';
import Home from './views/public/Home.vue';
import About from './views/public/About.vue';
import Join from './views/public/Join.vue';
import Bands from './views/private/Bands.vue';
import Band from './views/private/Band.vue';

Vue.use(Router);

// let Service = RestService;

export default new Router({
  routes: [
    {
      path: "/",      
      component: Layout,
      children: [
        {
          path: '/',
          component: Home,
          props: true
        },
        {
          path: '/about',
          component: About
        },
        {
          path: '/join/:token',
          component: Join
        },
        {
          path: '/bands',
          component: Bands
        },
        {
          path: '/band/:id',
          component: Band
        }
      ]
    },
  ]
});