import { axiosClient } from "@creator/common/axios";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import { createApp } from "vue";
import FindTourPage from "./FindTourPage.vue";
import ARembed from "./components/ARembed.vue";

import "bootstrap/scss/bootstrap.scss";
import "../sass/app.scss";

declare global {
  interface Window {
    axios: typeof axiosClient;
  }
}

window.axios = axiosClient;

const app = createApp({});
app.component("find-tour-page", FindTourPage);
app.component("ar-embed", ARembed);

app.mount("#app");
