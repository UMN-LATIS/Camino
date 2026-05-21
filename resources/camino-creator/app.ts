import { createApp } from "vue";
import { createPinia } from "pinia";
import { axiosClient } from "@/shared/axios";
import "bootstrap";

import "./main.scss";
import router from "./router";
import App from "./App.vue";
declare global {
  interface Window {
    axios: typeof axiosClient;
  }
}

window.axios = axiosClient;
const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
