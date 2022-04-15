import { defineStore, acceptHMRUpdate } from "pinia";

export const useTourStore = defineStore("tours", {
  state() {
    return {
      tours: [],
      error: null,
      isReady: false,
    };
  },
  getters: {
    getTourStops: (state) => (tourId) => {
      return state.tours.find((tour) => tour.id === tourId)?.stops ?? [];
    },
    getTour: (state) => (tourId) => {
      return state.tours.find((tour) => tour.id === tourId);
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
    async deleteTour(tourId) {
      return axios.delete(`/creator/edit/${tourId}`).then(() => {
        this.fetchTours();
      });
    },
    async deleteTourStop({ tourId, stopId }) {
      return axios.delete(`/creator/edit/${tourId}/stop/${stopId}`).then(() => {
        this.fetchTours();
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
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTourStore, import.meta.webpackHot)
  );
}
