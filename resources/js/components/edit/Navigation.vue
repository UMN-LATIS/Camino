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
          <b>Latitude:</b> {{ stage.targetPoint.lat }}, <b>Longitude:</b>
          {{ stage.targetPoint.lng }}
        </div>
        <!-- FIXME: This mutates the stage prop! -->
        <!-- eslint-disable -->
        <location-selector
          v-model:location="stage.targetPoint"
          v-model:route="stage.route"
          :generalarea="previousStop"
          :tour="tour"
          :basemap="tour.tour_content.custom_base_map"
          :stop="stop"
        ></location-selector>
        <!-- eslint-enable -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour", "stop"],
  computed: {
    previousStop: function () {
      var targetIndex;
      if (this.stop.id) {
        var currentStop = this.tour.stops.findIndex(
          (e) => e.id == this.stop.id
        );
        targetIndex = currentStop > 0 ? currentStop - 1 : false;
      } else {
        targetIndex =
          this.tour.stops.length > 2 ? this.tour.stops.length - 2 : false;
      }
      if (targetIndex === false) {
        return this.tour.start_location;
      } else {
        var targetStop = this.tour.stops[targetIndex];
        var nav = targetStop.stop_content.stages.filter(
          (s) => s.type == "navigation"
        );
        if (nav.length > 0 && nav[0].targetPoint) {
          return nav[0].targetPoint;
        }
      }
      return this.tour.start_location;
    },
  },
  created() {
    if (!this.stage.text) {
      this.$set(this.stage, "text", { placeholder: null });
      this.$set(this.stage, "buttonTitle", { English: "Show Map" });
      this.$set(this.stage, "targetPoint", null);
    }
  },
};
</script>
<style>
.css-icon {
  border-radius: 30px;
  height: 10px;
  width: 10px;
  z-index: 10;
}

.target-css-icon {
  border: 3px solid red;
  background-color: red;
}
</style>
