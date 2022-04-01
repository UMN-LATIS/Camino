/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

import Vue from "vue";
import VueProgressBar from "vue-progressbar";
import i18n from "./i18n";
import CoolLightBox from "vue-cool-lightbox";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Permissions from "./mixins/Permissions";
import { languages } from "./languages";
import { store } from "./store";
import { router } from "./route";

import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

// TODO: if we're going to import bootstrap vue, can we ditch our other import?
import {
  BButton,
  ModalPlugin,
  CollapsePlugin,
  NavbarPlugin,
} from "bootstrap-vue";

Vue.use(ModalPlugin);
Vue.use(CollapsePlugin);
Vue.use(NavbarPlugin);
Vue.use(CoolLightBox);
Vue.use(VueProgressBar, {
  color: "#8C2F1B",
  failedColor: "red",
  thickness: "3px",
  position: "relative",
});

Vue.component("b-button", BButton);
Vue.component("navbar", require("./components/Nav.vue").default);
Vue.component("site-nav", require("./components/SiteNav.vue").default);
Vue.component("stop-content", require("./components/StopContent.vue").default);
Vue.component("gallery", require("./components/Gallery.vue").default);
Vue.component("quiz", require("./components/Quiz.vue").default);
Vue.component("ar", require("./components/AR.vue").default);
Vue.component("embed-frame", require("./components/EmbedFrame.vue").default);
Vue.component("ar-embed", require("./components/ARembed.vue").default);
Vue.component("guide", require("./components/Guide.vue").default);
Vue.component("deepdives", require("./components/DeepDives.vue").default);
Vue.component("navigation", require("./components/Navigation.vue").default);
Vue.component("language", require("./components/Language.vue").default);
Vue.component("feedback", require("./components/Feedback.vue").default);
Vue.component("find-tour", require("./components/FindTour.vue").default);
Vue.component("save-alert", require("./components/edit/SaveAlert.vue").default);
Vue.component("button-modal", require("./components/ButtonModal.vue").default);
Vue.component("error", require("./components/error.vue").default);
Vue.component(
  "transport-icon",
  require("./components/TransportIcon.vue").default
);
Vue.component("debug-bar", require("./components/DebugBar.vue").default);
Vue.component("separator", require("./components/Separator.vue").default);
Vue.component(
  "deepdives-summary",
  require("./components/DeepDivesSummary.vue").default
);

Vue.mixin({
  methods: {
    marked: function (input) {
      return marked(input);
    },
  },
});

Vue.mixin({
  methods: {
    purify: function (input) {
      return DOMPurify.sanitize(input, {}).replace(/&gt;+/g, ">"); // convert gt back to > so markdown can do its thing
    },
  },
});

Vue.mixin(Permissions);
Vue.config.ignoredElements = ["a-text", "a-scene", "a-camera"];
Vue.prototype.languages = languages;

new Vue({
  store,
  router,
  i18n,
  el: "#app",
});

i18n.locale = "English";
