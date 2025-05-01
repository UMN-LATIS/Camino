import { defineStore } from "pinia";
import { toursService } from "../common/api.service";
import { Maybe, Tour, Locale, BottomNavSheet } from "@/types";
import { useRoute } from "vue-router";
import normalizeTour from "@/shared/normalizeTour";
import { useStorage } from "@vueuse/core";
import { reactive, computed, toRefs } from "vue";

const toInt = (str) => Number.parseInt(str, 10);

export const useTrekkerStore = defineStore("trekker", () => {
  const route = useRoute();
  const storageKey = `camino.trekker.tour-${route.params.tourId}.trekkerStore`;

  const state = reactive({
    tour: null as Maybe<Tour>,
    isLoading: true,
    locale: useStorage<Locale>(`${storageKey}.locale`, Locale.en),
    errors: [] as string[],
    activeSheet: null as Maybe<BottomNavSheet>,
  });

  const allStops = computed(() => state.tour?.stops ?? []);
  const totalStops = computed(() => state.tour?.stops.length ?? 0);
  const stopIndex = computed(() => {
    const stopIndex = Array.isArray(route.params.stopIndex)
      ? route.params.stopIndex[0]
      : route.params.stopIndex;
    return Number.parseInt(stopIndex) ?? 0;
  });

  const tourId = computed(() => {
    return toInt(route.params.tourId);
  });
  const isFirstStop = computed(() => stopIndex.value === 0);
  const isLastStop = computed(() => stopIndex.value === totalStops.value - 1);
  const currentStop = computed(() => allStops.value[stopIndex.value]);
  const nextStop = computed(() => {
    if (isLastStop.value) return null;
    return allStops.value[stopIndex.value + 1];
  });
  const previousStop = computed(() => {
    if (isFirstStop.value) return null;
    return allStops.value[stopIndex.value - 1];
  });
  const supportedLocales = computed(
    () => state.tour?.tour_content?.languages ?? []
  );

  const isActiveSheet = (sheetKey: Maybe<BottomNavSheet>): boolean => {
    return state.activeSheet === sheetKey;
  };

  const actions = {
    fetchTour(tourId) {
      state.isLoading = true;
      toursService
        .get(tourId)
        .then((tour) => {
          state.isLoading = false;
          state.tour = normalizeTour(tour);
        })
        .catch((err) => {
          console.error(err);
          state.isLoading = false;
          state.errors.push(err);
        });
    },
    setLocale(locale: Locale) {
      state.locale = locale;
    },
    setActiveSheet(sheetKey: Maybe<BottomNavSheet>) {
      state.activeSheet = sheetKey;
    },
    closeActiveSheet() {
      actions.setActiveSheet(null);
    },
  };

  return {
    ...toRefs(state),
    ...actions,
    allStops,
    totalStops,
    stopIndex,
    tourId,
    isFirstStop,
    isLastStop,
    currentStop,
    nextStop,
    previousStop,
    supportedLocales,
    isActiveSheet,
  };
});
