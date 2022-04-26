import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import EditPage from "./pages/EditPage/EditPage.vue";
import TourStopPage from "./pages/TourStopPage/TourStopPage.vue";
import FeedbackViewPage from "./pages/FeedbackViewPage.vue";

const routes = [
  {
    path: "/creator",
    component: HomePage,
  },
  {
    path: "/creator/tours/create",
    name: "createTour",
    component: EditPage,
  },
  {
    path: "/creator/tours/:tourId",
    name: "editTour",
    component: EditPage,
    props: (route) => ({
      tourId: Number.parseInt(route.params.tourId, 10),
    }),
  },
  {
    path: "/creator/tours/:tourId/stops/create",
    name: "createStop",
    component: TourStopPage,
    props: (route) => ({
      tourId: Number.parseInt(route.params.tourId, 10),
    }),
  },
  {
    path: "/creator/tours/:tourId/stops/:stopId",
    name: "editStop",
    component: TourStopPage,
    props: (route) => ({
      tourId: Number.parseInt(route.params.tourId, 10),
      stopId: Number.parseInt(route.params.stopId, 10),
    }),
  },
  {
    path: "/creator/tours/:tourId/feedback",
    name: "tourFeedback",
    component: FeedbackViewPage,
    props: (route) => ({
      tourId: Number.parseInt(route.params.tourId, 10),
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
