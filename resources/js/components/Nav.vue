<template>
    <div class="sticky-top">
        <div class="row  navHeader no-gutters">
            <div class="col-3 text-left navButton">
                <router-link v-if="previousStop" :to="{ name: 'tour', params: { currentStop: previousStop }}" class="controlButton p-2">&laquo; {{ $t("nav.prev") }} </router-link>
            </div>
            <div class="col-6 text-center navToggle ">
                <a class="p-2" @click.prevent="collapseVisible = !collapseVisible" role="button" href="#" aria-expanded="false" >{{ currentStop }}</a>

            </div>
            <div class="col-3 text-right navButton" >
                <router-link v-if="nextStop" :to="{ name: 'tour', params: { currentStop: nextStop }}" class="controlButton p-2">{{ $t("nav.next") }} &raquo;</router-link>
            </div>
        </div>
        <!-- https://stackoverflow.com/questions/40573011/dynamically-inject-vue-2-component-from-shortcode -->
        <!-- https://medium.com/@maeganwilson_/how-to-create-a-navigation-bar-in-vue-js-8a70e7f29f80?source=-----8a70e7f29f80---------------------post_regwall-&skipOnboarding=1 -->
        <!-- https://www.codementor.io/@mblarsen/wordpress-shortcodes-vuejs-vue-js-5gv4op8sm -->
        <!-- https://gist.github.com/mblarsen/f628fc3c196b5f58d326242061922446 -->
        <b-collapse id="collapse-1" class="row mx-0 border-bottom" v-model="collapseVisible">
            <div class="col px-0">
                <div class="list-group list-group-flush" >
                    <router-link  to="/" class="list-group-item list-group-item-action">{{ $t("nav.home") }}</router-link>
                    <router-link v-for="(stop, index) in tour.stops" :key="index" :to="{ name: 'tour', params: { currentStop: stop.title}}" class="list-group-item list-group-item-action">{{ stop.title }}</router-link>
                </div>
            </div>
        </b-collapse>
    </div>

</template>


<script>
export default {
    props: [
        'tour', 'currentStop'
    ],
    data() {
        return {
            collapseVisible: false
        }
    },
    computed: {
        previousStop: function() {
            for(var i=0; i<this.tour.stops.length; i++) {
                if(this.tour.stops[i].title == this.currentStop && i !== 0) {
                    return this.tour.stops[i-1].title;
                }
            }
            return false;
        },
        nextStop: function() {
            for(var i=0; i<this.tour.stops.length; i++) {
                if(this.tour.stops[i].title == this.currentStop && i + 1 < this.tour.stops.length) {
                    return this.tour.stops[i+1].title;

                }
            }
            return false;
        }

    },
    watch: {
        '$route' (to, from) {
            this.collapseVisible = false
        }
    }
}
</script>