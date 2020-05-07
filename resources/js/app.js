/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
    color: 'rgb(200, 100, 100)',
    failedColor: 'red',
    height: '2px',
    position: "relative"
})

import i18n from './i18n';


import CoolLightBox from 'vue-cool-lightbox'
Vue.use(CoolLightBox);

// TODO: if we're going to import bootstrap vue, can we ditch our other import?

import {
    BButton,
    ModalPlugin,
    CollapsePlugin,
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


Vue.component('navbar', require('./components/Nav.vue').default);
Vue.component('stop-content', require('./components/StopContent.vue').default);
Vue.component('gallery', require('./components/Gallery.vue').default);
Vue.component('ar', require('./components/AR.vue').default);
Vue.component('embed-frame', require('./components/EmbedFrame.vue').default);
Vue.component('ar-embed', require('./components/ARembed.vue').default);
Vue.component('guide', require('./components/Guide.vue').default);
Vue.component('navigation', require('./components/Navigation.vue').default);
Vue.component('hotwords', require('./components/Hotwords.vue').default);
Vue.component('hotword', require('./components/Hotword.vue').default);
Vue.component('feedback', require('./components/Feedback.vue').default);
Vue.component('find-tour', require('./components/FindTour.vue').default);


Vue.component('button-modal', require('./components/ButtonModal.vue').default);
Vue.component('error', require('./components/error.vue').default);
Vue.component('transport-icon', require('./components/TransportIcon.vue').default);

Vue.component('debug-bar', require('./components/DebugBar.vue').default);
Vue.component('separator', require('./components/Separator.vue').default);
Vue.component('hotwords-summary', require('./components/HotwordsSummary.vue').default);


import { map } from "leaflet";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";

import 'leaflet/dist/leaflet.css';
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";


var marked = require('marked');
Vue.mixin({
    methods: {
        marked: function (input) {
            return marked(input);
        }
    }
});

import DOMPurify from 'dompurify';
Vue.mixin({
    methods: {
        purify: function (input) {
            return DOMPurify.sanitize(input);
        }
    }
});

import Permissions from './mixins/Permissions';
Vue.mixin(Permissions);


Vue.config.ignoredElements = [
    "a-text",
    "a-scene",
    "a-camera"
]

import { store } from "./store";
import { router } from "./route";


const app = new Vue({
    store,
    router, 
    i18n,
    el: '#app',
});

i18n.locale = 'English';
