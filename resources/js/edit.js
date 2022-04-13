/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

import "bootstrap";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./components/edit/HomePage.vue";
import EditPage from "./components/edit/EditPage.vue";
import TourStopPage from "./components/edit/TourStopPage.vue";
import FeedbackViewPage from "./components/edit/FeedbackViewPage.vue";

import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

const routes = [
  {
    path: "/creator",
    component: HomePage,
  },
  {
    path: "/creator/create",
    name: "createTour",
    component: EditPage,
  },
  {
    path: "/creator/:tourId",
    name: "editTour",
    component: EditPage,
    props: true,
  },
  {
    path: "/creator/:tourId/addStop",
    name: "createStop",
    component: TourStopPage,
    props: true,
  },
  {
    path: "/creator/:tourId/edit/:stopId",
    name: "editStop",
    component: TourStopPage,
    props: true,
  },
  {
    path: "/creator/:tourId/viewFeedback",
    name: "tourFeedback",
    component: FeedbackViewPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp({
  mixins: [Permissions],
})
  .use(router)
  .mount("#app");
