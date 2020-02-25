<template>
    <div class="bootstrap-fs-modal" v-if="tour">
       <navbar :tour="tour" :currentStop="currentStop" />     
        <stop-content :tour="tour" :currentStop="currentStop"  :key="currentStop" />
     <div class="form-check form-check-inline">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" name="" id="" :checked="$store.state.config.simulateLocation" @change="$store.commit('setSimulateLocation', !$store.state.config.simulateLocation)"> Simulate Location
            </label>
        </div>
    </div>
    
</template>

<script>
    export default {
        props: [ "currentStop", "status"],
        data() {
            return {
                tour: false
            };
        },
        mounted() {
          axios.get("/tour.json" + "?" + this.$i18n.locale)
            .then( response => {
                this.tour = response.data
                if(this.currentStop == undefined) {
                    this.$router.replace({ "name": "tour", params: {"currentStop": this.tour.stops[0].title}})
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
