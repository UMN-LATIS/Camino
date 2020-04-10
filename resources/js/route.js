import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import home from './components/Home.vue';
import stop from './components/Stop.vue';

const routes = [{
        path: '/',
        component: home
    },
    {
        path: '/tour/:currentStop?/:status?',
        name: "tour",
        component: stop,
        props: true,
    }
];

export const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


