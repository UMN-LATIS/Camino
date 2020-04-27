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
                            <button @click="stage.waypoints.splice(key)" class="btn btn-outline-danger float-right"><i class="fas fa-trash"></i> Remove Waypoint</button>
                        </template>

                    </language-text>
                    <div class="form-group row">
                        <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
                        <div class="col-sm-6">
                            <div v-if="waypoint.location">
                                <b>Latitude:</b> {{ waypoint.location.lat}}, <b>Longitude:</b>
                                {{ waypoint.location.lng}}
                            </div>
                            <location-selector :location.sync="waypoint.location" :generalarea="tour.start_location" :basemap="tour.tour_content.custom_base_map">
                            </location-selector>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label for="altitude" class="col-sm-2 col-form-label">Altitude (optional)</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control"  v-model="waypoint.altitude" id="altitude" />
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
        props: ["stage", "languages", "tour"],
        created() {
            if (!this.stage.text && !this.stage.waypoints) {
                Vue.set(this.stage, "text", {
                    "placeholder": null
                });
                Vue.set(this.stage, "buttonTitle", {
                    "English": "Show AR"
                });
                Vue.set(this.stage, "waypoints", []);
            }
        }
    }
</script>