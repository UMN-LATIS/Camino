/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');


import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Vuex from 'vuex'
Vue.use(Vuex)

import i18n from './i18n';


// TODO: if we're going to import bootstrap vue, can we ditch our other import?

import {
    BButton,
    ModalPlugin,
    CollapsePlugin
} from 'bootstrap-vue'

Vue.component('b-button', BButton)
Vue.use(ModalPlugin);
Vue.use(CollapsePlugin)

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
Vue.component('stop-content', require('./components/StopContent.vue').default);
Vue.component('gallery', require('./components/Gallery.vue').default);
Vue.component('ar', require('./components/AR.vue').default);
Vue.component('ar-embed', require('./components/ARembed.vue').default);
Vue.component('guide', require('./components/Guide.vue').default);
Vue.component('navigation', require('./components/Navigation.vue').default);
Vue.component('hotwords', require('./components/Hotwords.vue').default);
Vue.component('hotword', require('./components/Hotword.vue').default);
Vue.component('button-modal', require('./components/ButtonModal.vue').default);
Vue.component('debug-bar', require('./components/DebugBar.vue').default);


import { map } from "leaflet";
import 'leaflet/dist/leaflet.css';

// require("aframe");

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
        path: '/tour/:currentStop?/:status?',
        name: "tour",
        component: stop,
        props: true,
    }
];

const router = new VueRouter({
    // mode: 'history',
    routes // short for `routes: routes`
})


const store = new Vuex.Store({
    state: {
        hotwords: [],
        config: { 
            simulateLocation: false
        }
    },
    mutations: {
        addHotword(state, hotword) {
            state.hotwords.push(hotword);
        },
        removeHotword(state, hotword) {
            state.hotwords = state.hotwords.filter(w => w !== hotword);
        },
        setSimulateLocation(state, simulateLocation) {
            state.config.simulateLocation = simulateLocation;
        }
    },
    getters: {
        hotwords: state => state.hotwords
    }
});
Vue.config.ignoredElements = [
    "a-text",
    "a-scene",
    "a-camera"
]

const app = new Vue({
    store,
    router, 
    i18n,
    el: '#app',
});

i18n.locale = 'en';
