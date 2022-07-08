<template>
  <MapPolyline
    :id="`route-${mapStop.id}`"
    :class="`tour-map-route--${variant}`"
    :positions="mapStop.route"
    :variant="variant"
  />
</template>
<script setup lang="ts">
import MapPolyline from "../MapPolyline/MapPolyline.vue";
import type { TourMapStop } from "@/types";

defineProps<{
  mapStop: TourMapStop;
  variant: "gradient-inactive" | "gradient-active";
}>();
</script>
