import "bootstrap";
import { axiosClient } from "@/shared/axios";
import { createApp } from "vue";
import FindTourPage from "./FindTourPage.vue";
import ARembed from "./components/ARembed.vue";

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
