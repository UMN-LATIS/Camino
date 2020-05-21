<template>
    <div>
        <language-text :text="stage.text" :languages="languages" :largetext="true">
            Navigation Text
        </language-text>
        <language-text :text="stage.buttonTitle" :languages="languages">
            Map Button Title
        </language-text>

        <div class="form-group row">
          <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
          <div class="col-sm-6">
              <div v-if="stage.targetPoint">
                  <b>Latitude:</b> {{ stage.targetPoint.lat}}, <b>Longitude:</b> {{ stage.targetPoint.lng}}
                </div>
                <location-selector :location.sync="stage.targetPoint" :route.sync="stage.route" :generalarea="previousStop" :tour="tour" :basemap="tour.tour_content.custom_base_map" :stop="stop"></location-selector>
            </div>
        </div>
    </div>

</template>

<style>

.css-icon {
    -webkit-border-radius: 30px;
    height: 10px;
    width: 10px;
    z-index: 10;
}

.target-css-icon {
    border: 3px solid red;
    background-color: red;
}


</style>
<script>

export default {
    props: ["stage", "languages", "tour", "stop"],
    created() {
        if(!this.stage.text) {
            Vue.set(this.stage, "text", {"placeholder": null});
            Vue.set(this.stage, "buttonTitle", {"English":"Show Map"});
            Vue.set(this.stage, "targetPoint", null);
        }
    },
    computed: {
        previousStop: function() {
            if(this.stop.id) {
                var currentStop = this.tour.stops.findIndex((e)=> e.id == this.stop.id);
                var targetIndex = (currentStop>0)?currentStop - 1:null;
            }
            else {
                var targetIndex = (this.tour.stops.length>2)?this.tour.stops.length - 2:null;
            }
            if(!targetIndex) {
                return this.tour.start_location;
            }
            else {
                var targetStop = this.tour.stops[targetIndex];
                var nav = targetStop.stop_content.stages.filter(s=> s.type == "navigation");
                if(nav.length > 0 && nav[0].targetPoint) {
                    return nav[0].targetPoint;
                }
            }
            return this.tour.start_location;

            
            
        }
    }
}
</script>



