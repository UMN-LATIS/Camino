<template>
    <div class="">
        <div class="form-group">
          <label for="">Tour Title</label>
          <input type="text"
            class="form-control" v-model="tour.title" placeholder="">
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="tour.public">
            Public
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="tour.active">
            Active
          </label>
        </div>

        <div class="form-group">
          <label for="">Languages</label>
          <div v-for="(language, key) in tour.tour_content.languages" :key="key">
          <input v-model="tour.tour_content.languages[key]" type="text" class="form-control">
          <button @click="tour.tour_content.languages.splice(key, 1)">Remove</button>
          </div>
          <button @click="tour.tour_content.languages.push('')">Add Langauge</button>
        </div>

        <div>
            <location-selector :location.sync="tour.tour_content.location"></location-selector>
        </div>

        <ul>
            <li v-for="stop in tour.stops" :key="stop.id">
                <router-link :to="{ name: 'editStop', params: { tourId: tourId, stopId: stop.id }}">{{ stop.stop_content.title[tour.tour_content.languages[0]] }} </router-link>
            </li>
        </ul>
        <!-- <tour-stop v-for="(stop, key) in tour.stops" :key=key :stop.sync="tour.stops[key]" :languages="tour.tour_content.languages"></tour-stop> -->
        <router-link :to="{ name: 'createStop', params: { tourId: tourId }}" class="btn btn-primary">Add Stop</router-link>

    <button @click="save">Save</button>


    </div>
</template>

<script>
// Someday, all of this should be moved to a pattern like https://zaengle.com/blog/using-v-model-on-nested-vue-components
   

    export default {
        props: ["tourId"],
        data() {
            return {
                tour: {
                    public: false,
                    active: false,
                    title: "",
                    tour_content: {
                        languages: ["English"],
                        location: null
                    },
                    stops: []
                    
                }
            }
        },
        methods: {
            save: function() {
                if(!this.tour.id) {
                    axios.post("/creator/edit", this.tour)
                    .then((res) => {
                        this.$router.replace("/edit/" + res.data.id);
                        this.savedAlert();
                    });
                }
                else {
                    axios.put("/creator/edit/" + this.tour.id, this.tour)
                    .then((res) => {
                        this.savedAlert();
                    });
                }
            },
            savedAlert: function() {
                this.$bvToast.toast('Stop saved', {
                    title: `Saved`,
                    variant: "success",
                    autoHideDelay: 3000,
                    solid: true
                })
        }
        },
        mounted: function() {
            if(this.tourId) {
                axios.get("/creator/edit/" + this.tourId )
                .then((res) => {
                    this.tour = res.data
                });
            }
            
        }
    }

</script>
