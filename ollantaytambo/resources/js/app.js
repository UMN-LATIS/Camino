/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');


import VueRouter from 'vue-router'

Vue.use(VueRouter)

import i18n from './i18n';

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

import home from './components/Home.vue';
import stop from './components/Stop.vue';


Vue.component('navbar', require('./components/Nav.vue').default);
Vue.component('gallery', require('./components/Gallery.vue').default);
Vue.component('guide', require('./components/Guide.vue').default);
Vue.component('navigation', require('./components/Navigation.vue').default);
Vue.component('hotwords', require('./components/Hotwords.vue').default);
Vue.component('hotword', require('./components/Hotword.vue').default);


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


const routes = [{
        path: '/',
        component: home
    },
    {
        path: '/tour/:currentStop?',
        name: "tour",
        component: stop,
        props: true
    }
];

const router = new VueRouter({
    // mode: 'history',
    routes // short for `routes: routes`
})

const app = new Vue({
    router, 
    i18n,
    el: '#app',
});

i18n.locale = 'en';
