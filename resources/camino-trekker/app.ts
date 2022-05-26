import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { sync } from "vuex-router-sync";
import "./globalStyles.js";

// keep vuex and vue-router in sync
sync(store, router);

const app = createApp(App);

app.use(router).use(store).mount("#app");
