import { defineStore, acceptHMRUpdate } from "pinia";

export const useTourStore = defineStore("tours", {
  state() {
    return {
      tours: [],
      error: null,
      loading: false,
    };
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
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTourStore, import.meta.webpackHot)
  );
}
