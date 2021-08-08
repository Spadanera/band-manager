import Vue from 'vue';
import Router from 'vue-router';
// import RestService from './services/rest/rest-services';

// Component
import Public from './views/Public.vue';
import Home from './views/public/Home.vue';
import About from './views/public/About.vue';
import Join from './views/public/Join.vue';

Vue.use(Router);

// let Service = RestService;

export default new Router({
  routes: [
    {
      path: "/",      
      component: Public,
      children: [
        {
          path: '/',
          name: "home",
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
        }
      ]
    },
  ]
});