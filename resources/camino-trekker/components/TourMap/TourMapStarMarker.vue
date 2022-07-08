<template>
  <MapMarker :lng="lng" :lat="lat" :draggable="draggable">
    <MapMarkerLabel :color="color" :pulse="pulse">
      <span class="material-icons"> star </span>
    </MapMarkerLabel>
  </MapMarker>
</template>
<script setup lang="ts">
import MapMarkerLabel from "../MapMarkerLabel/MapMarkerLabel.vue";
import MapMarker from "../MapMarker/MapMarker.vue";

withDefaults(
  defineProps<{
    lng: number;
    lat: number;
    color?: "pink" | "orange" | "default";
    pulse?: boolean;
    draggable?: boolean;
  }>(),
  {
    color: "default",
    pulse: false,
    draggable: false,
  }
);
</script>
