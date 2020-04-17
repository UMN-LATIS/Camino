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

        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="tour.tour_content.use_template">
            Start stops with standard template
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
            <initial-location :location.sync="tour.start_location"></initial-location>
        </div>

        <div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="tour.tour_content.custom_base_map" value="checkedValue" checked>
                Custom base Map
              </label>
            </div>
            <div v-if="tour.tour_content.custom_base_map">
                <img :src="'/storage/' + tour.tour_content.custom_base_map_image" v-if="tour.tour_content.custom_base_map_image" class="img-responsive">
                <image-upload v-if="!tour.tour_content.custom_base_map_image" v-on:imageuploaded="imageUploaded($event)"></image-upload>
                <div class="form-group">
                  <label for="">Upper Left Latitude</label>
                  <input type="text"
                    class="form-control" v-model="tour.tour_content.custom_base_map_coords.upperleft.lat" aria-describedby="helpId" placeholder="">
                </div>
                <div class="form-group">
                  <label for="">Upper Left Longitude</label>
                  <input type="text"
                    class="form-control" v-model="tour.tour_content.custom_base_map_coords.upperleft.lng" aria-describedby="helpId" placeholder="">
                </div>
                    <div class="form-group">
                  <label for="">Lower Right Latitude</label>
                  <input type="text"
                    class="form-control" v-model="tour.tour_content.custom_base_map_coords.lowerright.lat" aria-describedby="helpId" placeholder="">
                </div>
                <div class="form-group">
                  <label for="">Lower Right Longitude</label>
                  <input type="text"
                    class="form-control" v-model="tour.tour_content.custom_base_map_coords.lowerright.lng" aria-describedby="helpId" placeholder="">
                </div>
            </div>
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
                    start_location: null,
                    tour_content: {
                        use_template: false,
                        languages: ["English"],
                        custom_base_map: false,
                        custom_base_map_image: null,
                        custom_base_map_coords: {
                            "upperleft":{
                            "lat": null,
                            "lng": null
                            },
                            "lowerright":{
                            "lat": null,
                            "lng": null
                            }
                        }

                    },
                    stops: []
                    
                }
            }
        },
        methods: {
            imageUploaded: function(value) {
                this.tour.tour_content.custom_base_map_image = value;
            },
            save: function() {
                if(!this.tour.id) {
                    axios.post("/creator/edit", this.tour)
                    .then((res) => {
                        this.$router.replace("/creator/" + res.data.id);
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
