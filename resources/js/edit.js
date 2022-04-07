/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

import Vue from "vue";

// TODO: if we're going to import bootstrap vue, can we ditch our other import?

// import { BButton, ModalPlugin, BVToastPlugin } from "bootstrap-vue";

// Vue.component("b-button", BButton);
// Vue.use(ModalPlugin);
// Vue.use(CollapsePlugin)
// Vue.use(BVToastPlugin);

import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

Vue.config.ignoredElements = ["a-text", "a-scene", "a-camera"];

import VueQRCodeComponent from "vue-qrcode-component";
Vue.component("QrCode", VueQRCodeComponent);

import VueRouter from "vue-router";
Vue.use(VueRouter);

import home from "./components/edit/Home.vue";
Vue.component("Home", home);

import edit from "./components/edit/Edit.vue";
Vue.component("Edit", edit);

import feedbackView from "./components/edit/FeedbackView.vue";
Vue.component("FeedbackView", feedbackView);

import tourStop from "./components/edit/TourStop.vue";
Vue.component("TourStop", tourStop);

import "v-markdown-editor/dist/v-markdown-editor.css";
import Editor from "v-markdown-editor";
Vue.use(Editor);

import Permissions from "./mixins/Permissions";
Vue.mixin(Permissions);

Vue.component("TourStop", require("./components/edit/TourStop.vue").default);
Vue.component(
  "LanguageText",
  require("./components/edit/LanguageText.vue").default
);
Vue.component("Stage", require("./components/edit/Stage.vue").default);

Vue.component("ButtonModal", require("./components/ButtonModal.vue").default);
Vue.component("Error", require("./components/error.vue").default);
Vue.component(
  "TransportIcon",
  require("./components/TransportIcon.vue").default
);

Vue.component(
  "CustomMarkdown",
  require("./components/edit/CustomMarkdown.vue").default
);
Vue.component(
  "ImageUpload",
  require("./components/edit/ImageUpload.vue").default
);
Vue.component("SaveAlert", require("./components/edit/SaveAlert.vue").default);

Vue.component("Separator", require("./components/edit/Separator.vue").default);
Vue.component(
  "Language",
  require("./components/edit/LanguageSelector.vue").default
);
Vue.component(
  "Navigation",
  require("./components/edit/Navigation.vue").default
);
Vue.component("Guide", require("./components/edit/Guide.vue").default);
Vue.component("Deepdives", require("./components/edit/DeepDives.vue").default);
Vue.component("Ar", require("./components/edit/AR.vue").default);
Vue.component("EmbedFrame", require("./components/edit/Embed.vue").default);
Vue.component("Gallery", require("./components/edit/Gallery.vue").default);
Vue.component(
  "DeepdivesSummary",
  require("./components/edit/DeepDiveSummary.vue").default
);
Vue.component("Feedback", require("./components/edit/Feedback.vue").default);
Vue.component("Quiz", require("./components/edit/Quiz.vue").default);

Vue.component(
  "LocationSelector",
  require("./components/edit/LocationSelector.vue").default
);
Vue.component(
  "InitialLocation",
  require("./components/edit/LocationSelector.vue").default
);

const routes = [
  {
    path: "/creator",
    component: home,
  },
  {
    path: "/creator/create",
    name: "createTour",
    component: edit,
  },
  {
    path: "/creator/:tourId?",
    name: "editTour",
    component: edit,
    props: true,
  },
  {
    path: "/creator/:tourId?/addStop",
    name: "createStop",
    component: tourStop,
    props: true,
  },
  {
    path: "/creator/:tourId?/edit/:stopId",
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
    path: "/creator/:tourId?/viewFeedback",
    name: "tourFeedback",
    component: feedbackView,
    props: true,
  },
];

import { languages } from "./languages";
Vue.prototype.languages = languages;

const router = new VueRouter({
  mode: "history",
  routes, // short for `routes: routes`
});

new Vue({
  router,
  el: "#app",
});
