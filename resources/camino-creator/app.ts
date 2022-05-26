/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import "bootstrap";
import initAxios from "./common/initAxios";
import initLeaflet from "./common/initLeaflet";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router.js";
import App from "./App.vue";

const pinia = createPinia();

initAxios();
initLeaflet();

createApp(App).use(pinia).use(router).mount("#app");
