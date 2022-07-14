import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./globalStyles";

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia).mount("#app");
