<template>
    <div>
        <language-text :text="stage.buttonTitle" :languages="languages">
            AR Button Title
        </language-text>

        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Waypoints</label>
            <div class="col-sm-10">
                <button @click="stage.waypoints.push({'location':null, 'text':{'placeholder':null}, 'altitude':null})"
                    class="btn btn-primary"><i class="fas fa-plus"></i> Add
                    waypoint</button>
                <div v-for="(waypoint, key) in stage.waypoints" :key="key" class="border rounded mt-2 p-2">
                    
                    
                    <language-text :text="waypoint.text" :languages="languages">
                        Text
                        <template v-slot:languageaddon>
                            <button @click="stage.waypoints.splice(key, 1)" class="btn btn-outline-danger float-right"><i class="fas fa-trash"></i> Remove Waypoint</button>
                        </template>

                    </language-text>
                    <div class="form-group row">
                        <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
                        <div class="col-sm-6">
                            <div v-if="waypoint.location">
                                <b>Latitude:</b> {{ waypoint.location.lat}}, <b>Longitude:</b>
                                {{ waypoint.location.lng}}
                            </div>
                            <location-selector :location.sync="waypoint.location" :generalarea="currentLocation" :basemap="tour.tour_content.custom_base_map">
                            </location-selector>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label for="altitude" class="col-sm-2 col-form-label">Altitude (optional)</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" aria-describedby="altitudeHelp"  v-model="waypoint.altitude" id="altitude" />
                             <small id="altitudeHelp" class="form-text text-muted">In meters, relative to this stop's elevation.</small>
                        </div>

                        
                    </div>
                    
                </div>
            </div>
        </div>



    </div>

</template>

<style scoped>

</style>

<script>
    export default {
        props: ["stage", "languages", "tour", "stop"],
        created() {
            if (!this.stage.text && !this.stage.waypoints) {
                this.$set(this.stage, "text", {
                    "placeholder": null
                });
                this.$set(this.stage, "buttonTitle", {
                    "en": "Show AR"
                });
                this.$set(this.stage, "waypoints", []);
            }
        },
        computed: {
            currentLocation: function() {
                if(this.stop.id) {
                    var nav = this.stop.stop_content.stages.filter(s=> s.type == "navigation");
                    if(nav.length > 0 && nav[0].targetPoint) {
                        return nav[0].targetPoint;
                    }
                }
                else {
                    return this.tour.start_location;
                }

            }
        }
    }
</script>