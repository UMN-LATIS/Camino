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
