<template>
    <div>
        <error :error="error" />
        <h1>{{ tour.title }}</h1>
        <div class="form-group row">
            <label for="tourTitle" class="col-sm-1 col-form-label">Tour Title</label>
            <div class="col-sm-6">
                <input type="text" class="form-control" v-model="tour.title" placeholder="" id="tourTitle">
            </div>
        </div>

        <div class="form-group row">
            <label class="col-sm-1 "><b>Languages</b></label>
            <div class="col-sm-10 flex-wrap flex-column language-container">
                <div v-for="(language, key) in languages" :key="key" class="form-check">
                    <label class="form-check-label">
                        <input :value="key" v-model="tour.tour_content.languages" type="checkbox"
                            class="form-check-input">
                        {{ key }}
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label for="tourTitle" class="col-sm-1 col-form-label">Location</label>
            <div class="col-sm-6">
                <div v-if="tour.start_location">
                    <b>Latitude:</b> {{ tour.start_location.lat}}, <b>Longitude:</b> {{ tour.start_location.lng}}
                </div>
                <initial-location :location.sync="tour.start_location" :basemap="tour.tour_content.custom_base_map">
                </initial-location>
            </div>
        </div>


        <div class="form-group row">
            <label for="tourTitle" class="col-sm-1"><b>Transport</b></label>
            <div class="col-sm-6 ">
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="tour.walking" value="1">
                        Walk
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="tour.biking" value="1">
                        Bike
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="tour.driving" value="1">
                        Drive
                    </label>
                </div>

            </div>
        </div>

        
        <div class="form-group row">
            <label for="tourStyle" class="col-sm-1"><b>Tour Style</b></label>
            <div class="col-sm-6 ">
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="radio" name="tourStyle" class="form-check-input" v-model="tour.style" value="entire_tour">
                        Reveal entire tour
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="radio" name="tourStyle" class="form-check-input" v-model="tour.style" value="next_stop">
                        Only reveal next stop
                    </label>
                </div>
            </div>
        </div>
             <div class="form-group row">
            <label for="sharing" class="col-sm-1"><b>Sharing</b></label>
            <div class="col-sm-6 ">
                <div class="input-group">
                  <input type="text"
                    class="form-control" name="" id="" v-model="shareAddress" aria-describedby="helpId" placeholder="">
                     <div class="input-group-append">
                        <button class="btn btn-outline-secondary" @click="share" type="button">Share</button>
                    </div>
                    </div>
                    
                  <small id="helpId" class="form-text text-muted">Enter a full email address</small>
                  <strong v-if="invitationSent">Invitation Sent</strong>
                  <div v-if="tour.users.length > 1 " >
                  <p class="mb-0">Shared With:</p>
                  <ul class="mt-0">
                      <li v-for="user in tour.users" :key="user.id">{{ user.email }}</li>
                   </ul>
                   </div>
                      
            </div>
        </div>

        <div class="form-check">
            <label class="form-check-label" >
                <input type="checkbox" class="form-check-input" v-model="tour.public" :disabled="!$can('publish publicly')">
                Public <span v-if="!$can('publish publicly')"  class="help-text">(<a href="mailto:mcfa0086@umn.edu">Contact us</a> for permission to publish tour publicly)</span>
            </label>
            
        </div>


        <div>
            <div class="form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input"
                        v-model="tour.tour_content.custom_base_map.use_basemap" value="checkedValue" checked>
                    Custom base Map
                </label>
            </div>
            <div v-if="tour.tour_content.custom_base_map.use_basemap">

                <image-upload v-if="!tour.tour_content.custom_base_map.image"
                    v-on:imageuploaded="imageUploaded($event)"></image-upload>
                <div class="row">
                    <div class="form-group col-sm-2">
                        <label for="upper-left-latitude">Upper Left Latitude</label>
                        <input type="text" class="form-control"
                            v-model="tour.tour_content.custom_base_map.coords.upperleft.lat" id="upper-left-latitude"
                            placeholder="">
                    </div>
                    <div class="form-group col-sm-2">
                        <label for="upper-left-longitude">Upper Left Longitude</label>
                        <input type="text" class="form-control"
                            v-model="tour.tour_content.custom_base_map.coords.upperleft.lng" id="upper-left-latitude"
                            placeholder="">
                    </div>
                    <div class="form-group col-sm-2">
                        <label for="lower-right-latitude">Lower Right Latitude</label>
                        <input type="text" class="form-control"
                            v-model="tour.tour_content.custom_base_map.coords.lowerright.lat" id="upper-left-latitude"
                            placeholder="">
                    </div>
                    <div class="form-group col-sm-2">
                        <label for="lower-right-latitude">Lower Right Longitude</label>
                        <input type="text" class="form-control"
                            v-model="tour.tour_content.custom_base_map.coords.lowerright.lng" id="upper-left-latitude"
                            placeholder="">
                    </div>
                    <div class="col-sm-2">
                        <img :src="'/storage/' + tour.tour_content.custom_base_map.image"
                            v-if="tour.tour_content.custom_base_map.image" class="img-thumbnail rounded">
                        <button @click="tour.tour_content.custom_base_map.image = null"
                            class="btn btn-outline-danger float-right" v-if="tour.tour_content.custom_base_map.image"><i
                                class="fas fa-trash"></i> Remove
                            basemap</button>
                    </div>
                </div>
            </div>
        </div>



        <div class="form-check">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="tour.tour_content.use_template">
                Use standard template
            </label>
        </div>

        <div class="form-check">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="tour.active">
                Active
                <p id="activeHelpId" class="form-text" v-if="tour.active">Tour URL: <strong><a
                            :href="tourURL">{{ tourURL }}</a></strong><qr-code :size="120" :text="tourURL"></qr-code></p>
            </label>
        </div>

        

        <div class="row mt-2">
            <div class="col d-flex justify-content-between align-items-center">
                <h3>Tour Stops</h3>
                <div>
                    <router-link :to="{ name: 'createStop', params: { tourId: tourId }}" class="btn btn-primary"
                        v-if="tour.id"><i class="fas fa-plus"></i> Add a Stop</router-link>
                </div>
            </div>
        </div>
        <draggable v-model="tour.stops" :move="checkMove" handle=".handle">
            <div class="card mt-2" v-for="stop in tour.stops" :key="stop.id">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <h5 class="card-title"><i class="fas fa-grip-vertical handle" v-if="!isLockedItem(stop)"></i>
                        {{ stop.stop_content.title[tour.tour_content.languages[0]] }}</h5>
                    <div class="controls">
                        <a href="#" @click="deleteStop(stop.id)" class="btn btn-outline-danger"><i
                                class="fas fa-trash"></i> <span class="d-none d-sm-inline">Delete</span></a>
                        <a :href="'/tour/' + tour.id + '/' + stop.sort_order" class="btn btn-outline-success"
                            target="_blank"><i class="fas fa-eye"></i> <span class="d-none d-sm-inline">Preview</span> </a>
                        <router-link :to="{ name: 'editStop', params: { tourId: tourId, stopId: stop.id }}"
                            class="btn btn-outline-primary"><i class="fas fa-edit"></i> <span class="d-none d-sm-inline">Edit</span></router-link>

                    </div>
                </div>
            </div>
        </draggable>

        <div class="form-group row mt-2">
            <label for="" class="col-sm-1 col-form-label">Hotwords</label>
            <div class="col-sm-6">
                <div class="col-form-label">You have {{ hotwords.length }} hotwords.</div>
                <router-link v-if="hotwords.length" :to="{ name: 'editHotwords', params: { tourId: tourId }}"
                    class="btn btn-outline-primary">Manage Hotwords <i class="fas fa-edit"></i></router-link>
            </div>
        </div>


        <div class="alert alert-danger" role="alert" v-if="errors.length > 0">
            <strong>Errors</strong>
            <ul>
                <li v-for="(error, key) in errors" :key="key">
                    {{ error }}
                </li>
            </ul>
        </div>

        <a :href="'/tour/' + tour.id" v-if="tour.id" class="btn btn-outline-success" target="_blank"><i
                class="fas fa-eye"></i> Preview</a>
        <button @click="save" class="btn btn-primary"><i class="fas fa-save"></i> Save</button>
        <save-alert :showAlert.sync="showAlert" />

    </div>
</template>

<style scoped>
    .handle {
        cursor: move;
    }

    .col-form-label {
        font-weight: bold;
    }

    .language-container {
        /* column-count: 3 */
    }

    .card-title {
        margin-bottom: 0px;
    }
</style>

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
                error: null,
                showAlert: false,
                errors: [],
                shareAddress: "",
                invitationSent: false,
                tour: {
                    id: null,
                    public: false,
                    active: false,
                    title: "",
                    start_location: null,
                    walking: 0,
                    biking: 0,
                    driving: 0,
                    style: "entire_tour",
                    tour_content: {
                        use_template: true,
                        languages: ["English"],
                        hotWords: {},
                        custom_base_map: {
                            use_basemap: false,
                            image: null,
                            coords: {
                                "upperleft": {
                                    "lat": null,
                                    "lng": null
                                },
                                "lowerright": {
                                    "lat": null,
                                    "lng": null
                                }
                            }
                        }

                    },
                    stops: [

                    ],
                    users: []

                }
            }
        },
        computed: {
            tourURL: function () {
                return location.protocol + "//" + location.hostname + (location.port?":":"")+location.port + "/tour/" + this.tourId;
            },
            hotwords: function () {
                return this.tour.stops.map(s => {
                    return s.stop_content.stages.map(stage => {
                        if (!stage.text) {
                            return [];
                        }
                        var cleanedMatches = [];
                        Object.entries(stage.text).forEach(([key, value]) => {
                            if (value) {
                                var matches = value.match(/<hotword/g);
                                if (matches) {
                                    cleanedMatches.push(matches.map(w => w.replace(
                                        /[\|\|]/g, '')));
                                }
                            }
                        });
                        return cleanedMatches;
                    });
                }).flat(4);
            }
        },
        methods: {
            deleteStop: function (stopId) {
                if (confirm("Are you sure you wish to delete this stop?")) {
                    axios.delete("/creator/edit/" + this.tour.id + "/stop/" + stopId)
                        .then((res) => {
                            this.loadTour();
                        }).catch(res => {
                            this.error = res;
                        });
                }

            },
            imageUploaded: function (value) {
                this.tour.tour_content.custom_base_map.image = value;
            },
            validate: function() {
                this.errors = [];
                if(!this.tour.title) {
                    this.errors.push("A title is required");
                }
                if(!this.tour.start_location) {
                    this.errors.push("A start location is required");
                }
                if(this.tour.tour_content.languages.length == 0) { 
                    this.errors.push("At least one language is required");
                }
                if(this.errors.length > 0) {
                    return false;
                }
                return true;

            },
            share: function() {
                axios.post("/creator/" + this.tour.id + "/share", { email: this.shareAddress})
                .then((res) => {
                    this.shareAddress = "";
                    this.invitationSent = true;
                    setTimeout(() => {
                        this.invitationSent = false;
                    }, 2000);
                })
            },
            save: function () {
                if(!this.validate()) {
                    return;
                }
                if (!this.tour.id) {
                    axios.post("/creator/edit", this.tour)
                        .then((res) => {
                            this.$router.replace("/creator/" + res.data.id);
                            this.tour.id = res.data.id;
                            Vue.set(this.tour, "stops", res.data.stops);
                            this.showAlert = true;
                        }).catch(res => {
                            this.error = res;
                        });
                } else {
                    axios.put("/creator/edit/" + this.tour.id, this.tour)
                        .then((res) => {
                            this.showAlert = true;
                        }).catch(res => {
                            this.error = res;
                        });
                }
            },
            loadTour: function () {
                if (this.tourId) {
                    axios.get("/creator/edit/" + this.tourId)
                        .then((res) => {
                            this.tour = res.data
                            document.title = "Editing : " + this.tour.title
                        }).catch(res => {
                            this.error = res;
                        });
                }
            },
            checkMove(e) {
                return this.isDraggable(e.draggedContext);
            },
            isDraggable(context) {
                const {
                    index,
                    futureIndex
                } = context
                return !(this.isLockedItem(this.tour.stops[index]) || this.isLockedItem(this.tour.stops[futureIndex]));
            },
            isLockedItem(stop) {
                return (stop.sort_order == 0 || stop.sort_order == (this.tour.stops.map(s=>s.sort_order).reduce((a,b)=> Math.max(a,b))));
            }
        },
        mounted: function () {
            this.loadTour();

        }
    }
</script>