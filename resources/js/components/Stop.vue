<template>
    <div class="bootstrap-fs-modal" v-if="tour">

       <navbar :tour="tour" :currentStopId="currentStopId" />     
        <stop-content class="stop-container" :tour="tour" :currentStop="tour.stops[currentStopId]"  :key="currentStopId" :currentStopId="currentStopId" />
        <debug-bar v-if='$can("edit own tours")'/>
    </div>
    <error v-else :error="error"/>
    
</template>

<script>
    export default {
        props: [
            "currentStopId", 
            "status",
            "tourId"
        ],
        data() {
            return {
                tour: false,
                error: null
            };
        },
        mounted() {
            axios.get("/api/tour/" + this.tourId)
            .then( response => {
                this.tour = response.data
                if(this.currentStopId == undefined || isNaN(this.currentStopId)) {
                    this.$router.replace({ "name": "tour", params: {"currentStopId": 0}})
                }
            })
            .catch (error => this.error = error)
        },
        computed: {
        },
        watch: {
            '$route' (to, from) {
                document.title = this.tour.title + " : " + this.tour.stops[this.currentStopId].stop_content.title[this.$i18n.locale];
                // todo: scroll to stop
            // react to route changes...
            }
        }
    }

</script>
