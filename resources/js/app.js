import "bootstrap";
import initAxios from "../camino-creator/common/initAxios.js";
import initLeaflet from "../camino-creator/common/initLeaflet.js";
import { createApp } from "vue";
import FindTourPage from "./FindTourPage.vue";

initAxios();
initLeaflet();

const app = createApp({});
app.component("find-tour-page", FindTourPage);
app.component("ar-embed", () => import("./components/ARembed.vue"));

app.mount("#app");
