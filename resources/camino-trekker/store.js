import { createStore, createLogger } from "vuex";
import { toursService } from "./common/api.service.js";

const toInt = (str) => Number.parseInt(str, 10);

export const initialState = {
  tour: null,
  isLoading: true,
  locale: "en",
  errors: [],
  deepDives: [],
};

export const getters = {
  allStops(state) {
    const { tour } = state;
    if (!tour) return [];
    return tour.stops;
  },
  totalStops(state) {
    if (!state.tour) return 0;
    return state.tour.stops.length;
  },
  stopIndex(state) {
    return toInt(state.route.params.stopIndex || 0);
  },
  tourId(state) {
    return toInt(state.route.params.tourId);
  },
  isFirstStop(_, getters) {
    return getters.stopIndex === 0;
  },
  isLastStop(_, getters) {
    return getters.stopIndex === getters.totalStops - 1;
  },
  currentStop(_, getters) {
    return getters.allStops?.[getters.stopIndex] || null;
  },
  nextStop(state, getters) {
    if (getters.isLastStop) return null;
    return state.getters.allStops[getters.stopIndex + 1];
  },
  previousStop(state, getters) {
    if (getters.isFirstStop) return null;
    return state.getters.allStops[getters.stopIndex - 1];
  },
};

export const mutations = {
  fetchTourStarted(state) {
    state.isLoading = true;
  },
  fetchTourSucceeded(state, tour) {
    state.isLoading = false;
    state.tour = tour;
  },
  fetchTourFailed(state, error) {
    state.isLoading = false;
    state.errors.push(error);
  },
  setLocale(state, locale) {
    state.locale = locale;
  },
  addDeepDive(state, deepdive) {
    const hasDeepDive = state.deepDives.indexOf(deepdive) > -1;
    if (hasDeepDive) return;
    state.deepDives.push(deepdive);
  },
  removeDeepDive(state, deepdive) {
    state.deepDives = state.deepDives.filter((d) => d !== deepdive);
  },
};

export const actions = {
  fetchTour({ commit }, tourId) {
    commit("fetchTourStarted");
    toursService
      .get(tourId)
      .then((tour) => {
        commit("fetchTourSucceeded", tour);
      })
      .catch((err) => {
        console.error(err);
        commit("fetchTourFailed", err);
      });
  },
  setLocale({ commit }, locale) {
    commit("setLocale", locale);
  },
  addDeepDive({ commit }, deepdive) {
    commit("addDeepDive", deepdive);
  },
  removeDeepDive({ commit }, deepdive) {
    commit("removeDeepDive", deepdive);
  },
};

export const storeConfig = {
  state: () => initialState,
  getters,
  mutations,
  actions,
  plugins: [createLogger()],
};

export const store = createStore(storeConfig);

export default store;
