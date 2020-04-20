<template>
    <div class="bootstrap-fs-modal" v-if="tour">
       <navbar :tour="tour" :currentStopId="currentStopId" />     
        <stop-content class="stop-container" :tour="tour" :currentStop="tour.stops[currentStopId]"  :key="currentStopId" :currentStopId="currentStopId" />
        <debug-bar />
    </div>
    
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
            .catch (error => console.log(error))
            
        },
        computed: {
        },
        watch: {
            '$route' (to, from) {
                // todo: scroll to stop
            // react to route changes...
            }
        }
    }

</script>
