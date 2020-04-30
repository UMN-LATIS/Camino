import Vuex from 'vuex';
import Vue from 'vue';


Vue.use(Vuex)

import {
    router
} from "./route";

import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

export const store = new Vuex.Store({
    state: {
        hotwords: [],
        config: { 
            simulateLocation: true,
            simulateMobile: false
        }
    },
    mutations: {
        addHotword(state, hotword) {
            if (!Array.isArray(state.hotwords[router.currentRoute.params.tourId])) {
                Vue.set(state.hotwords, router.currentRoute.params.tourId, []);
            }
            state.hotwords[router.currentRoute.params.tourId].push(hotword);
        },
        removeHotword(state, hotword) {
            Vue.set(state.hotwords, router.currentRoute.params.tourId, state.hotwords[router.currentRoute.params.tourId].filter(w => w !== hotword))

        },
        setSimulateLocation(state, simulateLocation) {
            state.config.simulateLocation = simulateLocation;
        },
        setSimulateMobile(state, simulateMobile) {
            state.config.simulateMobile = simulateMobile;
        }
    },
    getters: {
        hotwords: state => {
            if (!Array.isArray(state.hotwords[router.currentRoute.params.tourId]) ) {
                return [];
            }
            return state.hotwords[router.currentRoute.params.tourId];
        }
    },
    plugins: [vuexLocal.plugin]
});
