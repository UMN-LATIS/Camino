<template>
    <div>

        <div v-if="tour">
            <language-text :languages="tour.tour_content.languages" :text.sync="stop.stop_content.title">
                Stop Title
            </language-text>

            <draggable v-model="stop.stop_content.stages" handle=".handle">
                <stage v-for="(stage,key) in stop.stop_content.stages" :key='key' :stage="stage"
                    v-on:remove="stop.stop_content.stages.splice(key)">
                    <component :is="stage.type" :stage="stage" :languages="tour.tour_content.languages" :tour="tour">
                    </component>
                </stage>
            </draggable>

            <div class="form-group">
                <div class="row">
                    <label class="col-2 col-form-label text-right" for="">New Stage Type</label>
                    <select class="form-control col-2" v-model="newStageType">
                        <option disabled></option>
                        <option v-for="(stageType, key) in stageTypes" :key="key" :value="key">{{ stageType }}</option>
                    </select>
                    <div class="col-2">
                        <button class="btn btn-primary" @click="addStage">Add Stage</button>
                    </div>
                </div>
            </div>


        </div>
        <router-link :to="{'name': 'editTour', params: { tourId: tourId }}" class="btn btn-primary">Back to Tour
        </router-link> <button @click="save" class="btn btn-primary">Save</button><save-alert :showAlert.sync="showAlert" />
        <!-- {{ stop }} -->
    </div>
</template>

<script>
import draggable from 'vuedraggable'

    export default {
        props: ["stopId", "tourId"],
        components: {
            draggable
        },
        data() {
            return {
                showAlert: false,
                newStageType: null,
                stageTypes: {
                    "seperator": "Seperator",
                    "ar": "AR",
                    "embed-frame": "Embed",
                    "guide": "Guide",
                    "gallery": "Gallery",
                    "navigation": "Navigation"
                },
                tour: null,
                stop: {
                    stop_content: {
                        "title": {},
                        "stages": []
                    }
                },
                stop_template: {
                    stop_content: {
                        "title": {},
                        "stages": [{
                                "text": {
                                    "English": "Navigation"
                                },
                                "type": "seperator"
                            },
                            {
                                "text": {"placeholder": null},
                                "type": "navigation",
                                "buttonTitle": {
                                    "English": "Show Map"
                                },
                                "targetPoint": null
                            },
                            {
                                "text": {
                                    "English": "Guide"
                                },
                                "type": "seperator"
                            },
                            {
                                "text": {"placeholder": null},
                                "type": "guide"
                            }
                        ]
                    }
                }
            }
        },
        methods: {
            addStage: function () {
                this.stop.stop_content.stages.push({
                    "type": this.newStageType
                });
            },
            goBack: function () {
                this.$router.go(-1);
            },
            save: function () {
                console.log(this.stop);
                if (!this.stop.id) {
                    axios.post("/creator/edit/" + this.tour.id + "/stop/", this.stop)
                        .then((res) => {
                            this.stop.id = res.data.id;
                            this.$router.replace({
                                name: 'editStop',
                                params: {
                                    tourId: this.tourId,
                                    stopId: this.stop.id
                                }
                            })
                            this.showAlert = true;
                        });
                } else {
                    axios.put("/creator/edit/" + this.tour.id + "/stop/" + this.stop.id, this.stop)
                        .then((res) => {
                            this.showAlert = true;
                        });
                }
            }
        },
        mounted: function () {
            axios.get("/creator/edit/" + this.tourId)
                .then((res) => {
                    this.tour = res.data
                    if (this.stopId) {
                        this.stop = this.tour.stops.find(s => s.id == this.stopId);
                    }
                    else if(this.tour.tour_content.use_template) {
                        this.stop = this.stop_template;
                    }
                });


        },
        // created: function() {
        //     if(!this.stop.title) {
        //         Vue.set(this.stop, "title", {});
        //         Vue.set(this.stop, "stages", []);
        //     }
        // }
    }
</script>