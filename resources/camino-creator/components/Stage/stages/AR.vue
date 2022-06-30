<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">Waypoints</label>
    <div class="col-sm-10">
      <button class="btn btn-primary" @click="handleAddWaypoint">
        <i class="fas fa-plus"></i> Add waypoint
      </button>
      <div
        v-for="(waypoint, index) in stage.waypoints"
        :key="index"
        class="border rounded mt-2 p-2 bg-light"
      >
        <div class="d-flex justify-content-end">
          <button class="btn float-end" @click="handleRemoveWaypoint(index)">
            <i class="fas fa-times"></i>
            <span class="sr-only">Remove Waypoint</span>
          </button>
        </div>

        <LanguageText
          :text="waypoint.text"
          :languages="supportedLanguages"
          @update:text="(text) => handleUpdateWaypoint(index, { text })"
        >
          Text
        </LanguageText>
        <div class="row">
          <label for="tourTitle" class="col-sm-2 col-form-label"
            >Location</label
          >
          <div class="col-sm-10 my-2">
            <MapboxLocationSelector
              class="border rounded bg-white"
              :location="waypoint.location"
              @update:location="
                (location) => handleUpdateWaypoint(index, { location })
              "
            >
            </MapboxLocationSelector>
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
                  altitude: Number.parseInt(
                    ($event.target as HTMLInputElement).value
                  ),
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
</template>

<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import MapboxLocationSelector from "@creator/components/MapboxLocationSelector.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
import { ARStage, Waypoint } from "@/types";
import { useCreatorStore } from "@/camino-creator/stores/useCreatorStore";

const props = defineProps<{
  stage: ARStage;
  tourId: number;
  stopId: number;
}>();

const emit = defineEmits<{
  (eventName: "update", updatedStage: ARStage);
}>();

const store = useCreatorStore();
const supportedLanguages = store.getTourLanguages(props.tourId);
const valuedTargetPoint = store.findValuedTargetPoint(
  props.tourId,
  props.stopId
);

function handleAddWaypoint() {
  const newWaypoint = {
    text: createEmptyLocalizedText(supportedLanguages.value),
    location: valuedTargetPoint.value,
    altitude: null,
  };
  const updatedStage = {
    ...props.stage,
    // add newest to top so that it's closer to the Add button
    // and more apparent that something changed.
    waypoints: [newWaypoint, ...props.stage.waypoints],
  };
  emit("update", updatedStage);
}

function handleRemoveWaypoint(index) {
  const updatesStage = {
    ...props.stage,
    waypoints: [
      ...props.stage.waypoints.slice(0, index),
      ...props.stage.waypoints.slice(index + 1),
    ],
  };
  emit("update", updatesStage);
}

function handleUpdateWaypoint(index: number, update: Partial<Waypoint>) {
  const updatedWaypoint: Waypoint = {
    ...props.stage.waypoints[index],
    ...update,
  };
  const updatedStage = {
    ...props.stage,
    waypoints: [
      ...props.stage.waypoints.slice(0, index),
      updatedWaypoint,
      ...props.stage.waypoints.slice(index + 1),
    ],
  };
  emit("update", updatedStage);
}
</script>
