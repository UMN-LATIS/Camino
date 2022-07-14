import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import TourPage from "./pages/TourPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import HelpPage from "./pages/HelpPage.vue";
import config from "./config";

const toInt = (value, fallback = undefined) => {
  const n = Number.parseInt(value);
  return Number.isNaN(n) ? fallback : n;
};

const routes = [
  { path: "/", component: HomePage },
  {
    path: "/tours/:tourId",
    redirect: (to) => `/tours/${to.params.tourId}/stops/0`,
  },
  {
    path: "/tours/:tourId/stops/:stopIndex",
    component: TourPage,
    props: (route) => ({
      tourId: toInt(route.params.tourId),
      stopIndex: toInt(route.params.stopIndex),
    }),
  },
  {
    path: "/settings",
    component: SettingsPage,
  },
  {
    path: "/help",
    component: HelpPage,
  },
];

const router = createRouter({
  history: createWebHistory(config.baseDir),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
