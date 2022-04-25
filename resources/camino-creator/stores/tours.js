import { defineStore, acceptHMRUpdate } from "pinia";
import defaultStop from "../common/defaultStop.js";

export const useTourStore = defineStore("tours", {
  state() {
    return {
      tours: [],
      error: null,
      isReady: false,
      newStop: null,
    };
  },
  getters: {
    getTour: (state) => (tourId) => {
      return state.tours.find((tour) => tour.id === tourId);
    },
    getTourStop:
      ({ getTour }) =>
      (tourId, stopId) => {
        const tour = getTour(tourId);
        return tour.stops.find((stop) => stop.id === stopId);
      },
    // getTourStopStage: (state) => (tourId, stopId, stageId) => {},
    getTourTitle:
      ({ getTour }) =>
      (tourId) => {
        return getTour(tourId).title;
      },
    getTourLanguages:
      ({ getTour }) =>
      (tourId) => {
        return getTour(tourId).tour_content.languages;
      },
    getDefaultTourLanguage:
      ({ getTour }) =>
      (tourId) => {
        return getTour(tourId).tour_content.languages[0] || "English";
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
      return axios.post("/creator/edit", tour).then((res) => {
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
    // create a draft new tour stop
    async initTourStop(tourId) {
      this.newStop = {
        ...defaultStop,
        tour_id: tourId,
      };
    },
    async createTourStop(tourId) {
      return axios
        .post(`/creator/edit/${tourId}/stop/`, this.newStop)
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
    // async createTourStopStage(tourId, stopId, stage) {},
    async updateTourStopStage(tourId, stopId, stage) {
      const tourStop = this.getTourStop(tourId, stopId);
      const stageIndex = tourStop.stop_content.stages.findIndex(
        (s) => s.id === stage.id
      );
      tourStop.stop_content.stages[stageIndex] = stage;
    },
    // async deleteTourStopStage(tourId, stopId, stageId) {},
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTourStore, import.meta.webpackHot)
  );
}
