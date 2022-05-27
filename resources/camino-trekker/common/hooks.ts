import { computed } from "vue";
import getFullTourRoute from "../utils/getFullTourRoute";
import config from "../config";
import { useTrekkerStore } from "../stores/useTrekkerStore";
import type { Ref } from "vue";
import type { Locale } from "@/types";

export const useTour = () => {
  const store = useTrekkerStore();
  return {
    tour: computed(() => store.tour),
  };
};

export const useStopIndex = () => {
  const store = useTrekkerStore();
  return {
    stopIndex: computed(() => store.stopIndex),
  };
};

export const useLocale = () => {
  const store = useTrekkerStore();
  return {
    locale: computed(() => store.locale),
    setLocale: store.setLocale,
  };
};

export const useMapBoxAccessToken = () => {
  return {
    accessToken: computed(() => config.mapBox.accessToken),
  };
};

export const useFullTourRoute = () => {
  const store = useTrekkerStore();
  return computed(() => {
    return {
      fullTourRoute: getFullTourRoute(store.tour),
    };
  });
};

export const useTourLocales = (): { tourLocales: Ref<Locale[]> } => {
  const store = useTrekkerStore();
  const tourLocales = computed(() => {
    if (!store.tour) {
      throw new Error("no tour is loaded in the store");
    }
    return store.tour.tour_content.languages;
  });

  return { tourLocales };
};
