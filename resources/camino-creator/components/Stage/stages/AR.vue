<template>
  <div>
    <LanguageText :text="stage.buttonTitle" :languages="languages">
      AR Button Title
    </LanguageText>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Waypoints</label>
      <div class="col-sm-10">
        <button class="btn btn-primary" @click="handleAddWaypoint">
          <i class="fas fa-plus"></i> Add waypoint
        </button>
        <div
          v-for="(waypoint, key) in stage.waypoints"
          :key="key"
          class="border rounded mt-2 p-2"
        >
          <LanguageText :text="waypoint.text" :languages="languages">
            Text
            <template #languageaddon>
              <button
                class="btn btn-outline-danger float-right"
                @click="handleRemoveWaypoint(key)"
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
                v-model:location="waypoint.location"
                :generalarea="currentLocation"
                :basemap="tour.tour_content.custom_base_map"
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
                v-model="waypoint.altitude"
                type="text"
                class="form-control"
                aria-describedby="altitudeHelp"
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
export default {
  components: {
    LanguageText,
    LocationSelector,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour", "stop"],
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
  created() {
    if (!this.stage.text && !this.stage.waypoints) {
      this.$set(this.stage, "text", {
        placeholder: null,
      });
      this.$set(this.stage, "buttonTitle", {
        English: "Show AR",
      });
      this.$set(this.stage, "waypoints", []);
    }
  },
  methods: {
    handleAddWaypoint() {
      // FIXME: This is a mutation of `stage` prop!
      // Ignoring the ESLint error for now until we can test.
      // Perhaps emit change?
      // eslint-disable-next-line vue/no-mutating-props
      this.stage.waypoints.push({
        text: {
          placeholder: null,
        },
        location: null,
        altitude: null,
      });
    },
    handleRemoveWaypoint(key) {
      // FIXME: This is a mutation of `stage` prop!
      // Ignoring the ESLint error for now until we can test.
      // Perhaps emit change?
      // eslint-disable-next-line vue/no-mutating-props
      this.stage.waypoints.splice(key, 1);
    },
  },
};
</script>
