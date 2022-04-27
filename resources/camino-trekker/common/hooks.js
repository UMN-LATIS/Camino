import { computed } from "vue";
import { useStore } from "vuex";
import getFullTourRoute from "../utils/getFullTourRoute.js";
import config from "../config.js";

export const useTour = () => {
  const store = useStore();
  return {
    tour: computed(() => store.state.tour),
  };
};

export const useStopIndex = () => {
  const store = useStore();
  return {
    stopIndex: computed(() => store.getters.stopIndex),
  };
};

export const useLocale = () => {
  const store = useStore();
  return {
    locale: computed(() => store.state.locale),
    setLocale: (newLocale) => store.dispatch("setLocale", newLocale),
  };
};

export const useMapBoxAccessToken = () => {
  return {
    accessToken: computed(() => config.mapBox.accessToken),
  };
};

export const useFullTourRoute = () =>
  computed(() => {
    const { tour } = useTour();
    return {
      fullTourRoute: getFullTourRoute(tour.value),
    };
  });

export const useTourLocales = () => {
  const { tour } = useTour();
  return {
    tourLocales: computed(() => tour.value.tour_content.languages),
  };
};
