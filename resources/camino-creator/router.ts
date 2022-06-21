import { createRouter, createWebHistory } from "vue-router";
import TourPage from "./pages/TourPage/TourPage.vue";
import TourStopPage from "./pages/TourStopPage/TourStopPage.vue";
import FeedbackViewPage from "./pages/FeedbackViewPage.vue";
import MyToursPage from "./pages/MyToursPage.vue";

const routes = [
  {
    path: "/creator",
    component: MyToursPage,
  },
  {
    path: "/creator/tours/create",
    name: "createTour",
    component: TourPage,
  },
  {
    path: "/creator/tours/:tourId",
    name: "editTour",
    component: TourPage,
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
