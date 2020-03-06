import Vuex from 'vuex';
import Vue from 'vue';


Vue.use(Vuex)


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
            state.hotwords.push(hotword);
        },
        removeHotword(state, hotword) {
            state.hotwords = state.hotwords.filter(w => w !== hotword);
        },
        setSimulateLocation(state, simulateLocation) {
            state.config.simulateLocation = simulateLocation;
        },
        setSimulateMobile(state, simulateMobile) {
            state.config.simulateMobile = simulateMobile;
        }
    },
    getters: {
        hotwords: state => state.hotwords
    },
    plugins: [vuexLocal.plugin]
});
