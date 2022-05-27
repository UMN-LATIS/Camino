import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import { mergeDeepRight } from "ramda";
import { defineStore, acceptHMRUpdate } from "pinia";
import createDefaultStop from "../common/createDefaultStop";
import createDefaultTour from "../common/createDefaultTour";
import { Tour, Maybe, TourStop, Locale } from "@/types";
import { axiosClient as axios } from "@creator/common/axios";

const route = useRoute();

interface State {
  tours: Tour[];
  error: Maybe<Error>;
  isReady: boolean;
  route: RouteLocationNormalizedLoaded;
}

export const useCreatorStore = defineStore("creator", {
  state: (): State => ({
    tours: [],
    error: null,
    isReady: false,
    route,
  }),
  getters: {
    getTour:
      (state: State) =>
      (tourId: number): Tour => {
        const tour = state.tours.find((tour) => tour.id === tourId);
        if (!tour) {
          throw new Error(
            `a tour with id ${tourId} does not exist in the store`
          );
        }
        return tour;
      },
    getTourStop() {
      const store = this;
      return (tourId, stopId): TourStop => {
        const tour = store.getTour(tourId);
        const stop = tour.stops.find((stop) => stop.id === stopId);
        if (!stop) {
          throw new Error(
            `tour stop with tour id ${tourId} and stop id $${stopId} does not exist in the`
          );
        }
        return stop;
      };
    },
    // getTourStopStage: (state) => (tourId, stopId, stageId) => {},
    getTourTitle() {
      const store = this;
      return (tourId: number): string => store.getTour(tourId).title;
    },
    getTourLanguages() {
      const store = this;
      return (tourId: number): Locale[] =>
        store.getTour(tourId).tour_content.languages;
    },
    getDefaultTourLanguage() {
      const store = this;
      return (tourId: number): Locale =>
        store.getTour(tourId).tour_content.languages[0] || Locale.en;
    },
  },
  actions: {
    async init() {
      await this.fetchTours();
      this.isReady = true;
    },
    async fetchTours() {
      return axios
        .get("/creator") // someday do .json routes in laravel
        .then((res) => {
          this.tours = res.data;
        });
    },
    async createTour(tour) {
      return axios
        .post("/creator/edit", mergeDeepRight(createDefaultTour(), tour))
        .then((res) => {
          this.fetchTours();
          return { payload: res.data };
        });
    },
    async updateTour(tour) {
      return axios.put(`/creator/edit/${tour.id}`, tour).then(() => {
        this.fetchTours();
      });
    },
    async deleteTour(tourId) {
      return axios.delete(`/creator/edit/${tourId}`).then(() => {
        this.fetchTours();
      });
    },
    async createTourStop(tourId, stop) {
      const newStop = mergeDeepRight(createDefaultStop(), stop);
      return axios
        .post(`/creator/edit/${tourId}/stop/`, newStop)
        .then((res) => {
          this.fetchTours();
          return { payload: res.data };
        });
    },
    async updateTourStop(tourId, stop) {
      return axios
        .put(`/creator/edit/${tourId}/stop/${stop.id}`, stop)
        .then((res) => {
          this.fetchTours();
          return { payload: res.data };
        });
    },
    async deleteTourStop(tourId, stopId) {
      return axios.delete(`/creator/edit/${tourId}/stop/${stopId}`).then(() => {
        this.fetchTours();
      });
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useCreatorStore, import.meta.webpackHot)
  );
}
