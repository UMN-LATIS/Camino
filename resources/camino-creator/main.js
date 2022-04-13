/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import "bootstrap";
import initAxios from "./common/initAxios";
import initLeaflet from "./common/initLeaflet";
import { createApp } from "vue";
import router from "./router.js";

initAxios();
initLeaflet();

createApp({
  // window.Permissions encodes the permissions of the current user
  // and is set server-side in the blade template `index.blade.php`
  mixins: [Permissions],
})
  .use(router)
  .mount("#app");
