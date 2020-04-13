/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');


// TODO: if we're going to import bootstrap vue, can we ditch our other import?

import {
    BButton,
    ModalPlugin,
    CollapsePlugin
} from 'bootstrap-vue'

Vue.component('b-button', BButton)
Vue.use(ModalPlugin);
Vue.use(CollapsePlugin)



import { map } from "leaflet";
import 'leaflet/dist/leaflet.css';

Vue.config.ignoredElements = [
    "a-text",
    "a-scene",
    "a-camera"
]


import VueRouter from 'vue-router'
Vue.use(VueRouter);

import home from './components/edit/Home.vue';
Vue.component('home',home);

import edit from './components/edit/edit.vue';
Vue.component('edit', edit);

Vue.component('tour-stop', require('./components/edit/TourStop.vue').default);
Vue.component('language-text', require('./components/edit/LanguageText.vue').default);
Vue.component('stage', require('./components/edit/Stage.vue').default);
Vue.component('seperator', require('./components/edit/Seperator.vue').default);


const routes = [{
    path: '/creator',
        component: home
    },
    {
        path: '/creator/:tourId',
        name: "editTour",
        component: edit,
        props: true,
    },
    {
        path: '/creator/create',
        name: "createTour",
        component: edit,
    }
    
];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

const app = new Vue({
    router,
    el: '#app',
});

