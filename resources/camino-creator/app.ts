import "bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { axiosClient } from "./common/axios";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import router from "./router.js";
import App from "./App.vue";
declare global {
  interface Window {
    axios: typeof axiosClient;
  }
}

window.axios = axiosClient;

createApp(App).use(createPinia()).use(router).mount("#app");
