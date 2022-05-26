import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./globalStyles.js";

const app = createApp(App);

app.use(router).use(createPinia()).mount("#app");
