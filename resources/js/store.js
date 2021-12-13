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
        deepdives: [],
        maxStop: 0,
        config: { 
            simulateLocation: false,
            simulateMobile: false
        },
        locks: []
    },
    mutations: {
        setMaxStop(state, maxStop) {
            state.maxStop = maxStop;
        },
        addDeepDive(state, deepdive) {
            if (!Array.isArray(state.deepdives[router.currentRoute.params.tourId])) {
                Vue.set(state.deepdives, router.currentRoute.params.tourId, []);
            }
            state.deepdives[router.currentRoute.params.tourId].push(deepdive);
        },
        removeDeepDive(state, deepdive) {
            Vue.set(state.deepdives, router.currentRoute.params.tourId, state.deepdives[router.currentRoute.params.tourId].filter(w =>  w.id !=  deepdive.id))

        },
        setSimulateLocation(state, simulateLocation) {
            state.config.simulateLocation = simulateLocation;
        },
        setSimulateMobile(state, simulateMobile) {
            state.config.simulateMobile = simulateMobile;
        },
        unlockStop(state, {stop, text}) {

            var element = state.locks[stop].find(element => element.text == text);
            if(element) {
                element.locked = false;
            }
        },
        lockStop(state, {stop, text}) {
            if(!state.locks[stop]) {
                Vue.set(state.locks, stop, []);
            }

            var element = state.locks[stop].find(element => element.text == text);
            if(element) {
                element.locked = true;
            }
            else {
                element = { "text": text, "locked": true};
                state.locks[stop].push(element);
            }


        },
        resetLocks(state) {
            Vue.set(state, "locks", []);
        },
        resetDives(state) {
            Vue.set(state, "deepdives", []);
        }
    },
    getters: {
        deepdives: state => {
            if (!Array.isArray(state.deepdives[router.currentRoute.params.tourId]) ) {
                return [];
            }
            return state.deepdives[router.currentRoute.params.tourId];
        }
    },
    plugins: [vuexLocal.plugin]
});
