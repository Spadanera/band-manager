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
import BandsPublic from './views/public/Bands.vue';
import EventsPublic from './views/public/Events.vue';

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
        },
        {
          path: '/about',
          component: About
        },
        {
          path: '/public-events',
          component: EventsPublic
        },
        {
          path: '/public-bands',
          component: BandsPublic
        }
      ]
    },
  ]
});