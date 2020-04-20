import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import home from './components/Home.vue';
import stop from './components/Stop.vue';

const routes = [{
        path: '/tour/',
        component: home
    },
    {
        path: '/tour/:tourId/:currentStopId?/:status?',
        name: "tour",
        component: stop,
        props(route) {
            const props = {
                ...route.params
            }
            props.currentStopId = +props.currentStopId
            return props
        }
    }

];

export const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


