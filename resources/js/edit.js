/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import Vue from 'vue' 


// TODO: if we're going to import bootstrap vue, can we ditch our other import?

import {
    BButton,
    ModalPlugin,
    BVToastPlugin,
    CollapsePlugin
} from 'bootstrap-vue'

Vue.component('b-button', BButton)
Vue.use(ModalPlugin);
// Vue.use(CollapsePlugin)
Vue.use(BVToastPlugin)



import {
    map
} from "leaflet";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js"
import "leaflet-draw/dist/leaflet.draw.js"
import "leaflet-draw/dist/leaflet.draw.css"

import 'leaflet/dist/leaflet.css';
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

Vue.config.ignoredElements = [
    "a-text",
    "a-scene",
    "a-camera"
]

import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

import VueRouter from 'vue-router'
Vue.use(VueRouter);





import home from './components/edit/Home.vue';
Vue.component('home',home);

import edit from './components/edit/Edit.vue';
Vue.component('edit', edit);

import feedbackView from './components/edit/FeedbackView.vue';
Vue.component('feedback-view', feedbackView);


import tourStop from './components/edit/TourStop.vue';
Vue.component('tour-stop', tourStop);


import 'v-markdown-editor/dist/v-markdown-editor.css';
import Editor from 'v-markdown-editor'
Vue.use(Editor);


import Permissions from './mixins/Permissions';
Vue.mixin(Permissions);

Vue.component('tour-stop', require('./components/edit/TourStop.vue').default);
Vue.component('language-text', require('./components/edit/LanguageText.vue').default);
Vue.component('stage', require('./components/edit/Stage.vue').default);


Vue.component('button-modal', require('./components/ButtonModal.vue').default);
Vue.component('error', require('./components/error.vue').default);
Vue.component('transport-icon', require('./components/TransportIcon.vue').default);

Vue.component('custom-markdown', require('./components/edit/CustomMarkdown.vue').default);
Vue.component('file-upload', require('./components/edit/FileUpload.vue').default);
Vue.component('save-alert', require('./components/edit/SaveAlert.vue').default);

Vue.component('separator', require('./components/edit/Separator.vue').default);
Vue.component('language', require('./components/edit/LanguageSelector.vue').default);
Vue.component('navigation', require('./components/edit/Navigation.vue').default);
Vue.component('guide', require('./components/edit/Guide.vue').default);
Vue.component('deepdives', require('./components/edit/DeepDives.vue').default);
Vue.component('ar', require('./components/edit/AR.vue').default);
Vue.component('embed-frame', require('./components/edit/Embed.vue').default);
Vue.component('gallery', require('./components/edit/Gallery.vue').default);
Vue.component('audiofile', require('./components/edit/Audio.vue').default);
Vue.component('deep-dive-summary', require('./components/edit/DeepDiveSummary.vue').default);
Vue.component('feedback', require('./components/edit/Feedback.vue').default);
Vue.component('quiz', require('./components/edit/Quiz.vue').default);

Vue.component('location-selector', require('./components/edit/LocationSelector.vue').default);
Vue.component('initial-location', require('./components/edit/LocationSelector.vue').default);


const routes = [{
    path: '/creator',
        component: home
    },
    {
        path: '/creator/create',
        name: "createTour",
        component: edit,
    },
    {
        path: '/creator/:tourId?',
        name: "editTour",
        component: edit,
        props: true,
    },
    {
        path: '/creator/:tourId?/addStop',
        name: "createStop",
        component: tourStop,
        props: true,
    },
    {
        path: '/creator/:tourId?/edit/:stopId',
        name: "editStop",
        component: tourStop,
        props: true,
    },
    // {
    //     path: '/creator/:tourId?/hotwords',
    //     name: "editHotwords",
    //     component: hotwordEditor,
    //     props: true,
    // }, 
    {
        path: '/creator/:tourId?/viewFeedback',
        name: "tourFeedback",
        component: feedbackView,
        props: true,
    }
    
];

import { languages } from './languages';
Vue.prototype.languages= languages;

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

const app = new Vue({
    router,
    el: '#app',
});

