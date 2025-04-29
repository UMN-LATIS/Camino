<template>
  <MapMarker
    :key="`marker-${mapStop.id}`"
    :lng="mapStop.stopPoint.lng"
    :lat="mapStop.stopPoint.lat"
    :color="mapStop.color"
    class="tour-map__marker"
  >
    <MapMarkerLabel
      :color="getMapMarkerColor(mapStop)"
      :pulse="mapStop.isActive"
    >
      {{ mapStop.index + 1 }}
    </MapMarkerLabel>
    <MapPopup>
      <p class="map-popup__stop-number-container">
        <span class="map-popup__stop-number">
          {{ mapStop.number }}
        </span>
      </p>
      <h2 class="map-popup__stop-title">
        {{ mapStop.title }}
      </h2>
      <p class="map-popup__link-container">
        <button class="map-popup__link" @click="$emit('click', mapStop)">
          <span class="material-icons">arrow_forward</span>
          <span class="sr-only">Go to Stop</span>
        </button>
      </p>
    </MapPopup>
  </MapMarker>
</template>
<script setup lang="ts">
import MapMarker from "../MapMarker/MapMarker.vue";
import MapMarkerLabel from "../MapMarkerLabel/MapMarkerLabel.vue";
import MapPopup from "../MapPopup/MapPopup.vue";

import type { TourMapStop } from "@/types";

defineProps<{
  mapStop: TourMapStop;
}>();

defineEmits<{
  (eventName: "click", stop: TourMapStop);
}>();

function getMapMarkerColor(stop: TourMapStop): "pink" | "orange" | "default" {
  if (stop.isActive) return "pink";
  if (stop.preceedsActive) return "orange";
  return "default";
}
</script>
