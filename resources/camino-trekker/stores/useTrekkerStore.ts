import { computed, ComputedRef, ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { toursService } from "../common/api.service";
import {
  Maybe,
  Tour,
  TourStop,
  Locale,
  DeepDiveItem,
  BottomNavSheet,
} from "@/types";
import { useRoute } from "vue-router";

const toInt = (str) => Number.parseInt(str, 10);

export const useTrekkerStore = defineStore("trekker", () => {
  const route = useRoute();

  // STATE
  const state = {
    tour: ref<Maybe<Tour>>(null),
    isLoading: ref<boolean>(true),
    locale: ref<Locale>(Locale.en),
    errors: ref<string[]>([]),
    deepDives: ref<DeepDiveItem[]>([]),
    activeSheet: ref<Maybe<BottomNavSheet>>(null),
  };

  // GETTERS (computed)
  const getters = {
    allStops: computed(() => state.tour.value?.stops ?? []),
    totalStops: computed(() => state.tour.value?.stops.length ?? 0),
    stopIndex: computed((): number => {
      const stopIndex = Array.isArray(route.params.stopIndex)
        ? route.params.stopIndex[0]
        : route.params.stopIndex;
      return Number.parseInt(stopIndex) ?? 0;
    }),
    tourId: computed(() => toInt(route.params.tourId)),
    isFirstStop: computed((): boolean => getters.stopIndex.value === 0),
    isLastStop: computed(
      (): boolean => getters.stopIndex.value === getters.totalStops.value - 1
    ),
    currentStop: computed(
      (): TourStop => getters.allStops.value[getters.stopIndex.value]
    ),
    nextStop: computed((): Maybe<TourStop> => {
      if (getters.isLastStop.value) return null;
      return getters.allStops.value[getters.stopIndex.value + 1];
    }),
    previousStop: computed((): Maybe<TourStop> => {
      if (getters.isFirstStop.value) return null;
      return getters.allStops.value[getters.stopIndex.value - 1];
    }),
    supportedLocales: computed((): Locale[] => {
      return state.tour.value?.tour_content?.languages ?? [];
    }),
    isActiveSheet: (sheetKey: Maybe<BottomNavSheet>) =>
      computed((): boolean => state.activeSheet.value === sheetKey),
  };

  // ACTIONS
  const actions = {
    fetchTour(tourId) {
      state.isLoading.value = true;
      toursService
        .get(tourId)
        .then((tour) => {
          state.isLoading.value = false;
          state.tour.value = tour;
        })
        .catch((err) => {
          console.error(err);
          state.isLoading.value = false;
          state.errors.value.push(err);
        });
    },
    setLocale(locale: Locale) {
      state.locale.value = locale;
    },
    setActiveSheet(sheetKey: Maybe<BottomNavSheet>) {
      state.activeSheet.value = sheetKey;
    },
    closeActiveSheet() {
      actions.setActiveSheet(null);
    },
    addDeepDive(deepdive) {
      const hasDeepDive = state.deepDives.value.indexOf(deepdive) > -1;
      if (hasDeepDive) return;
      state.deepDives.value.push(deepdive);
    },
    removeDeepDive(deepdive) {
      state.deepDives.value = state.deepDives.value.filter(
        (d) => d !== deepdive
      );
    },
  };

  return {
    ...state,
    ...getters,
    ...actions,
  };
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useTrekkerStore, import.meta.webpackHot)
  );
}
