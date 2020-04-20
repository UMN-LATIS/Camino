<template>
    <div class="sticky-top">
        <div class="row  navHeader no-gutters">
            <div class="col-3 text-left navButton">
                <router-link v-if="previousStop !== false" :to="{ name: 'tour', params: { currentStopId: previousStop }}" class="controlButton p-2">&laquo; {{ $t("nav.prev") }} </router-link>
            </div>
            <div class="col-6 text-center navToggle ">
                <a class="p-2" @click.prevent="collapseVisible = !collapseVisible" role="button" href="#" aria-expanded="false" >{{ currentStop.title[$i18n.locale] }}</a>

            </div>
            <div class="col-3 text-right navButton" >
                <router-link v-if="nextStop !== false" :to="{ name: 'tour', params: { currentStopId: nextStop }}" class="controlButton p-2">{{ $t("nav.next") }} &raquo;</router-link>
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
                    <router-link  to="/" class="list-group-item list-group-item-action">{{ $t("nav.home") }}</router-link>
                    <router-link v-for="(stop, index) in tour.stops" :key="index" :to="{ name: 'tour', params: { currentStopId: index}}" class="list-group-item list-group-item-action">{{ stop.stop_content.title[$i18n.locale] }}</router-link>
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
    /* padding: 8px 16px; */
}

a:hover {
    background-color: #816C61;
    color: white;
}

.navHeader {
    background-color: #A89B9D;
    border-bottom: 1px solid#525E3E;
}

.navToggle {
    border-left: 1px solid #525E3E;
    border-right: 1px solid #525E3E;

}

.navButton {}

.navToggle a {
    color: white;
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
            collapseVisible: false
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
        }
    },
    methods: {
        setProgress: function() {
            this.$Progress.set((this.currentStopId+1 / this.tour.stops.length) * 100);
        }
    },
    watch: {
        '$route' (to, from) {
            this.collapseVisible = false
        },
        currentStopId: function(val) {
            this.setProgress();
        }
    },
    mounted: function() {
        this.setProgress();
    }
}
</script>