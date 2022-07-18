import { defineStore, acceptHMRUpdate } from "pinia";
import { toursService } from "../common/api.service";
import { Maybe, Tour, TourStop, Locale, BottomNavSheet } from "@/types";
import { useRoute } from "vue-router";
import normalizeTour from "@/shared/normalizeTour";
import { useStorage } from "@vueuse/core";

const toInt = (str) => Number.parseInt(str, 10);

export const useTrekkerStore = defineStore("trekker", {
  state: () => {
    const route = useRoute();

    const storageKey = `camino.trekker.tour-${route.params.tourId}.trekkerStore`;

    return {
      tour: useStorage<Maybe<Tour>>(`${storageKey}.tour`, null),
      isLoading: true,
      locale: useStorage<Locale>(`${storageKey}.locale`, Locale.en),
      errors: [] as string[],
      activeSheet: null as Maybe<BottomNavSheet>,
    };
  },
  getters: {
    allStops: (state) => state.tour?.stops ?? [],
    totalStops: (state) => state.tour?.stops.length ?? 0,
    stopIndex(): number {
      const route = useRoute();
      const stopIndex = Array.isArray(route.params.stopIndex)
        ? route.params.stopIndex[0]
        : route.params.stopIndex;
      return Number.parseInt(stopIndex) ?? 0;
    },
    tourId(): number {
      const route = useRoute();
      return toInt(route.params.tourId);
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
    supportedLocales(state): Locale[] {
      return state.tour?.tour_content?.languages ?? [];
    },
    isActiveSheet:
      (state) =>
      (sheetKey: Maybe<BottomNavSheet>): boolean =>
        state.activeSheet === sheetKey,
  },
  actions: {
    fetchTour(tourId) {
      this.isLoading = true;
      toursService
        .get(tourId)
        .then((tour) => {
          this.isLoading = false;
          this.tour = normalizeTour(tour);
        })
        .catch((err) => {
          console.error(err);
          this.isLoading = false;
          this.errors.push(err);
        });
    },
    setLocale(locale: Locale) {
      this.locale = locale;
    },
    setActiveSheet(sheetKey: Maybe<BottomNavSheet>) {
      this.activeSheet = sheetKey;
    },
    closeActiveSheet() {
      this.setActiveSheet(null);
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTrekkerStore, import.meta.webpackHot)
  );
}
