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
            <draggable v-model="tour.stops"> 
              <li v-for="stop in tour.stops" :key="stop.id">
                  <router-link :to="{ name: 'editStop', params: { tourId: tourId, stopId: stop.id }}">{{ stop.stop_content.title[tour.tour_content.languages[0]] }} </router-link>
              </li>
            </draggable>
        </ul>

        You have  {{ hotwords.length }} hotwords.  
        <router-link :to="{ name: 'editHotwords', params: { tourId: tourId }}">Define</router-link>
        

        <!-- <tour-stop v-for="(stop, key) in tour.stops" :key=key :stop.sync="tour.stops[key]" :languages="tour.tour_content.languages"></tour-stop> -->
        <router-link :to="{ name: 'createStop', params: { tourId: tourId }}" class="btn btn-primary" v-if="this.tour.id">Add Stop</router-link>
    <button @click="save" class="btn btn-primary">Save</button><save-alert :showAlert.sync="showAlert" />
    <a :href="'/tour/' + tour.id" v-if="tour.id">Preview</a>
    </div>
</template>


<script>
// Someday, all of this should be moved to a pattern like https://zaengle.com/blog/using-v-model-on-nested-vue-components
   import draggable from 'vuedraggable'        

    export default {
        props: ["tourId"],
        components: {
            draggable
        },
        data() {
            return {
                showAlert: false,
                tour: {
                    id: null,
                    public: false,
                    active: false,
                    title: "",
                    start_location: null,
                    tour_content: {
                        use_template: false,
                        languages: ["English"],
                        hotWords: {},
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
        computed: {
            hotwords: function () {
                return this.tour.stops.map(s => { 
                    return s.stop_content.stages.map(stage => {
                            if(!stage.text) {
                                return [];
                            }
                            var cleanedMatches = [];
                            Object.entries(stage.text).forEach(([key, value]) => {
                                if(value) {
                                    var matches = value.match(/\|(.*?)\|/g);
                                    if(matches) {
                                        cleanedMatches.push(matches.map(w=>w.replace(/[\|\|]/g, '')));
                                    }
                                }
                            });
                            return cleanedMatches;
                        });
                    }).flat(4);
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
                        this.tour.id = res.data.id;
                        this.showAlert = true;
                    });
                }
                else {
                    axios.put("/creator/edit/" + this.tour.id, this.tour)
                    .then((res) => {
                        this.showAlert = true;
                    });
                }
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
