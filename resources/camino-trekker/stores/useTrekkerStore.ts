import { defineStore, acceptHMRUpdate } from "pinia";
import { toursService } from "../common/api.service.js";
import { Maybe, Tour, TourStop, Locale, DeepDiveItem } from "@/types";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";

const toInt = (str) => Number.parseInt(str, 10);
const route = useRoute();

interface State {
  tour: Maybe<Tour>;
  isLoading: boolean;
  locale: Locale;
  errors: Error[];
  deepDives: DeepDiveItem[];
  route: RouteLocationNormalizedLoaded;
}

export const useTrekkerStore = defineStore("trekker", {
  state: (): State => ({
    tour: null,
    isLoading: true,
    locale: Locale.en,
    errors: [],
    deepDives: [],
    route,
  }),
  getters: {
    allStops: (state: State): TourStop[] => {
      return state.tour?.stops ?? [];
    },
    totalStops: (state: State): number => {
      if (!state.tour) return 0;
      return state.tour.stops.length;
    },
    stopIndex: (state: State): number => {
      return toInt(state.route.params.stopIndex || 0);
    },
    tourId: (state: State): number => {
      return toInt(state.route.params.tourId);
    },
    isFirstStop(): boolean {
      return this.stopIndex === 0;
    },
    isLastStop(): boolean {
      return this.stopIndex === this.totalStops - 1;
    },
    currentStop(): TourStop {
      return this.allStops[this.stopIndex];
    },
    nextStop(): Maybe<TourStop> {
      if (this.isLastStop) return null;
      return this.allStops[this.stopIndex + 1];
    },
    previousStop(): Maybe<TourStop> {
      if (this.isFirstStop) return null;
      return this.allStops[this.stopIndex - 1];
    },
  },
  actions: {
    fetchTour(tourId) {
      this.isLoading = true;
      toursService
        .get(tourId)
        .then((tour) => {
          this.isLoading = false;
          this.tour = tour;
        })
        .catch((err) => {
          console.error(err);
          this.isLoading = false;
          this.errors.push(err);
        });
    },
    setLocale(locale) {
      this.locale = locale;
    },
    addDeepDive(deepdive) {
      const hasDeepDive = this.deepDives.indexOf(deepdive) > -1;
      if (hasDeepDive) return;
      this.deepDives.push(deepdive);
    },
    removeDeepDive(deepdive) {
      this.deepDives = this.deepDives.filter((d) => d !== deepdive);
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTrekkerStore, import.meta.webpackHot)
  );
}
