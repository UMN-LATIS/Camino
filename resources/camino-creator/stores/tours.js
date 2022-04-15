import { defineStore, acceptHMRUpdate } from "pinia";

export const useTourStore = defineStore("tours", {
  state() {
    return {
      tours: [],
      error: null,
      loading: false,
    };
  },
  getters: {
    getTourStops: (state) => (tourId) => {
      console.log({ tours: state.tours });
      return state.tours.find((tour) => tour.id === tourId)?.stops ?? [];
    },
  },
  actions: {
    async fetchTours() {
      axios
        .get("/creator") // someday do .json routes in laravel
        .then((res) => {
          this.tours = res.data;
        })
        .catch((err) => {
          this.error = err;
        });
    },
    async deleteTour(tourId) {
      axios
        .delete(`/creator/edit/${tourId}`)
        .then(() => {
          this.fetchTours();
        })
        .catch((err) => {
          this.error = err;
        });
    },
    async deleteTourStop({ tourId, stopId }) {
      axios
        .delete(`/creator/edit/${tourId}/stop/${stopId}`)
        .then(() => {
          this.fetchTours();
        })
        .catch((err) => {
          this.error = err;
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
