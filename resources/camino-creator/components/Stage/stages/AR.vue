<template>
  <div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Waypoints</label>
      <div class="col-sm-10">
        <button class="btn btn-primary" @click="handleAddWaypoint">
          <i class="fas fa-plus"></i> Add waypoint
        </button>
        <div
          v-for="(waypoint, index) in stage.waypoints"
          :key="index"
          class="border rounded mt-2 p-2"
        >
          <LanguageText
            :text="waypoint.text"
            :languages="languages"
            @update:text="(text) => handleUpdateWaypoint(index, { text })"
          >
            Text
            <template #languageaddon>
              <button
                class="btn btn-outline-danger float-right"
                @click="handleRemoveWaypoint(index)"
              >
                <i class="fas fa-trash"></i> Remove Waypoint
              </button>
            </template>
          </LanguageText>
          <div class="form-group row">
            <label for="tourTitle" class="col-sm-2 col-form-label"
              >Location</label
            >
            <div class="col-sm-6">
              <div v-if="waypoint.location">
                <b>Latitude:</b> {{ waypoint.location.lat }}, <b>Longitude:</b>
                {{ waypoint.location.lng }}
              </div>
              <LocationSelector
                :location="waypoint.location"
                :generalarea="currentLocation"
                :basemap="tour.tour_content.custom_base_map"
                @update:location="
                  (location) => handleUpdateWaypoint(index, { location })
                "
              >
              </LocationSelector>
            </div>
          </div>

          <div class="form-group row">
            <label for="altitude" class="col-sm-2 col-form-label"
              >Altitude (optional)</label
            >
            <div class="col-sm-6">
              <input
                id="altitude"
                :value="waypoint.altitude"
                type="text"
                class="form-control"
                aria-describedby="altitudeHelp"
                @input="
                  handleUpdateWaypoint(index, {
                    altitude: Number.parseInt($event.target.value),
                  })
                "
              />
              <small id="altitudeHelp" class="form-text text-muted"
                >In meters, relative to this stop's elevation.</small
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageText from "../../LanguageText.vue";
import LocationSelector from "../../LocationSelector.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
export default {
  components: {
    LanguageText,
    LocationSelector,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour", "stop"],
  emits: ["update"],
  computed: {
    currentLocation() {
      if (this.stop.id) {
        var nav = this.stop.stop_content.stages.filter(
          (s) => s.type == "navigation"
        );
        if (nav.length > 0 && nav[0].targetPoint) {
          return nav[0].targetPoint;
        }
      } else {
        return this.tour.start_location;
      }
      return {
        lat: 0,
        lng: 0,
      };
    },
  },
  methods: {
    handleAddWaypoint() {
      const updatedStage = {
        ...this.stage,
        waypoints: this.stage.waypoints.concat({
          text: createEmptyLocalizedText(this.languages),
          location: null,
          altitude: null,
        }),
      };
      this.$emit("update", updatedStage);
    },
    handleUpdateWaypoint(index, propChange) {
      console.log("updateWaypoint", index, { propChange });
      const currentWaypoint = this.stage.waypoints[index];
      const updatedWaypoint = {
        ...currentWaypoint,
        ...propChange,
      };
      const updatedStage = {
        ...this.stage,
        waypoints: [
          ...this.stage.waypoints.slice(0, index),
          updatedWaypoint,
          ...this.stage.waypoints.slice(index + 1),
        ],
      };

      this.$emit("update", updatedStage);
    },
    handleRemoveWaypoint(index) {
      const updatesStage = {
        ...this.stage,
        waypoints: [
          ...this.stage.waypoints.slice(0, index),
          ...this.stage.waypoints.slice(index + 1),
        ],
      };
      this.$emit("update", updatesStage);
    },
  },
};
</script>
