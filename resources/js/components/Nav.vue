<template>
    <div class="sticky-top">
        <div class="row  navHeader no-gutters navbar-light">
            <div class="col-3 text-left navButton">
                <router-link v-if="previousStop !== false" :to="{ name: 'tour', params: { currentStopId: previousStop }}" class="controlButton p-2">&laquo; {{ $t("nav.prev") }} </router-link>
            </div>
            <div class="col-6 text-center navToggle ">
                <a class="p-2" @click.prevent="collapseVisible = !collapseVisible" role="button" href="#" aria-expanded="false" >{{ currentStop.title[$i18n.locale] }}</a>

            </div>
            <div class="col-3 text-right navButton">
                <router-link v-if="nextStop !== false && showNextButton" :to="{ name: 'tour', params: { currentStopId: nextStop }}" class="controlButton p-2">{{ $t("nav.next") }} &raquo;</router-link>
            </div>

        </div>
        <vue-progress-bar></vue-progress-bar>
        <!-- https://stackoverflow.com/questions/40573011/dynamically-inject-vue-2-component-from-shortcode -->
        <!-- https://medium.com/@maeganwilson_/how-to-create-a-navigation-bar-in-vue-js-8a70e7f29f80?source=-----8a70e7f29f80---------------------post_regwall-&skipOnboarding=1 -->
        <!-- https://www.codementor.io/@mblarsen/wordpress-shortcodes-vuejs-vue-js-5gv4op8sm -->
        <!-- https://gist.github.com/mblarsen/f628fc3c196b5f58d326242061922446 -->
        <b-collapse id="collapse-1" class="row mx-0 border-bottom" v-model="collapseVisible">
            <div class="col px-0">
                <div class="list-group list-group-flush" >
                    <router-link v-for="(stop, index) in fileredTourStops" :key="index" :to="{ name: 'tour', params: { currentStopId: index}}" class="list-group-item list-group-item-action">{{ stop.stop_content.title[$i18n.locale] }}</router-link>
                </div>
            </div>
        </b-collapse>
    </div>

</template>

<style scoped>

a {
    text-decoration: none;
    display: inline-block;
    width: 100%;
    color: white;
    /* padding: 8px 16px; */
}

a:hover {
    background-color: #024873;
    color: white;
}

.navHeader {
    background-color: #608BA6;
    /* background-color: #A89B9D; */
    border-bottom: 1px solid rgba(0,0,0,.5);
}

.navToggle {
    border-left: 1px solid rgba(0,0,0,.5);
    border-right: 1px solid rgba(0,0,0,.5);

}

.list-group-item-action {
    background-color: #608BA6;
}

.router-link-exact-active {
    background-color: #024873;
}
.navButton {}

.navToggle a {
    /* color: white; */
}

.dropdown-menu a {
    color: black;
}
</style>
<script>
export default {
    props: [
        'tour', 'currentStopId'
    ],
    data() {
        return {
            collapseVisible: false,
            maxStop: 0
        }
    },
    computed: {
        previousStop: function() {
            if(this.currentStopId == 0) {
                return false;
            }
            else {
                return this.currentStopId - 1;
            }
        },
        nextStop: function() {
            if(this.currentStopId + 1 < this.tour.stops.length) {
                return this.currentStopId + 1
            }
            return false;
        },
        currentStop: function() {
            return this.tour.stops[this.currentStopId].stop_content;
        },
        fileredTourStops: function() {
            if(this.tour.style == "entire_tour") {
                return this.tour.stops;
            }
            else {
                return this.tour.stops.filter((s,i) => i <= this.maxStop);
            }
        },
        showNextButton: function() {
            if(this.tour.style == "entire_tour") {
                return true;
            }
            if(this.$store.state.locks[this.currentStopId] && this.$store.state.locks[this.currentStopId].filter(e => e.locked).length > 0) {
                return false;
            }
            return true;
        }
    },
    methods: {
        setProgress: function() {
            this.$Progress.set(( (this.currentStopId+1) / this.tour.stops.length) * 100);
        }
    },
    watch: {
        '$route' (to, from) {
            this.collapseVisible = false
        },
        currentStopId: function(val) {

            this.setProgress();
            this.maxStop = Math.max(val, this.maxStop);
        },
        maxStop: function(val) {
            this.$store.commit('setMaxStop', val);
        }
    },
    mounted: function() {
        this.setProgress();
        this.maxStop = Math.max(this.currentStopId, this.maxStop);
    }
}
</script>