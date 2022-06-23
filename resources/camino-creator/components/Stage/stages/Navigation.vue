<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="tourLanguages"
      :largetext="true"
      @update:text="handleUpdateText"
    >
      Navigation Text
    </LanguageText>

    <div class="form-group row">
      <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
      <div class="col-sm-6">
        <div v-if="stage.targetPoint">
          <b>Latitude:</b> {{ stage.targetPoint.lat }}, <b>Longitude:</b>
          {{ stage.targetPoint.lng }}
        </div>
        <LocationSelector
          :location="stage.targetPoint"
          :route="stage.route"
          :generalarea="previousStopTargetPoint"
          :tour="tour"
          :basemap="tour.tour_content.custom_base_map"
          :stop="currentStop"
          @update:location="handleUpdateLocation"
          @update:route="handleUpdateRoute"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import getAllStopPoints from "../../../util/getAllStopPoints";
import LanguageText from "../../LanguageText.vue";
import LocationSelector from "../../LocationSelector.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { NavigationStage } from "@/types";

interface Props {
  tourId: number;
  stopId: number;
  stage: NavigationStage;
}

const props = defineProps<Props>();

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);
const tour = creatorStore.getTour(props.tourId);
const currentStopIndex = computed(() =>
  tour.value.stops.findIndex((s) => s.id === props.stopId)
);
const currentStop = computed(() => tour.value.stops[currentStopIndex.value]);
const previousStopTargetPoint = computed(() => {
  // if stop id not found or first stop, return tour start location
  if (currentStopIndex.value <= 0) {
    return tour.value.start_location;
  }

  const allStopPoints = getAllStopPoints(tour);
  return allStopPoints[currentStopIndex.value - 1];
});

const emit = defineEmits(["update"]);
function handleUpdateLocation(targetPoint) {
  emit("update", {
    ...props.stage,
    targetPoint,
  });
}

function handleUpdateRoute(route) {
  emit("update", {
    ...props.stage,
    route,
  });
}

function handleUpdateText(text) {
  emit("update", {
    ...props.stage,
    text,
  });
}
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
