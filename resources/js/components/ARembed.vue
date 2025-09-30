<template>
  <!-- eslint-enable vue/multi-word-component-names -->
  <!-- eslint-disable vue/component-name-in-template-casing -->
  <!-- eslint-disable vue/attribute-hyphenation -->
  <div class="ar-embed">
    <a-scene v-if="arStage" locar-webcam>
      <a-camera
        id="camera"
        look-controls
        wasd-controls
        locar-camera
        rotation-reader
      />

      <a-text
        v-for="w in processedWaypoints"
        :key="w.id"
        :value="w.value"
        :locar-entity-place="w.placeString"
        color="red"
        align="center"
        :scale="w.scaleString"
        side="double"
        :geometry="w.geometryString"
        material="color: #fff; opacity: 0.7"
        :z-offset="w.zOffset"
        look-at="#camera"
      />
    </a-scene>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import "aframe";
import "locar-aframe";
import "aframe-look-at-component";
import type {
  Waypoint,
  LngLat as Location,
  Tour,
  NavigationStage,
  ARStage,
  Locale,
} from "@/types";
import { clamp } from "ramda";

const props = defineProps<{
  tourId: number;
  stopIndex: number;
  simulateLocation: boolean;
  locale: Locale;
}>();

// Distance calculation constants
const METERS_PER_DEGREE = 111_139; // avg meters per degree of lat/lng
const DEFAULT_DISTANCE_METERS = 2000; // fallback if no target point available
const Z_FIGHTING_OFFSET = 0.001; // prevent flickering
const MIN_TEXT_SCALE = 0.1;
const MAX_TEXT_SCALE = 3;

const tour = ref<Tour | null>(null);

const currentStop = computed(() => {
  if (!tour.value) return null;
  return tour.value.stops[props.stopIndex]?.stop_content;
});

const arStage = computed((): ARStage | null => {
  if (!currentStop.value) return null;
  return currentStop.value.stages.find(
    (stage) => stage.type === "ar"
  ) as ARStage;
});

const navigationStage = computed((): NavigationStage | null => {
  if (!currentStop.value) return null;
  return currentStop.value.stages.find(
    (stage) => stage.type === "navigation"
  ) as NavigationStage;
});

// Convert location to A-Frame locar-entity-place format
function formatLocation(location: Location): string {
  return `latitude: ${location.lat}; longitude: ${location.lng};`;
}

// Calculate straight-line distance in meters between waypoint and navigation target
function calculateDistanceInMeters(waypoint: Waypoint): number {
  const targetLocation = navigationStage.value?.targetPoint;
  if (!targetLocation) return DEFAULT_DISTANCE_METERS;

  const latDiff = waypoint.location.lat - targetLocation.lat;
  const lngDiff = waypoint.location.lng - targetLocation.lng;
  return Math.sqrt(latDiff ** 2 + lngDiff ** 2) * METERS_PER_DEGREE;
}

// scale <a-text> based on the distance to the camera
// if scale = distance, then all text will appear the same size
// so we use a logarithmic scale to reduce the effect of distance
// and clamp the scale to a reasonable range
function calcTextScale(distance: number): number {
  const scaleFactor = clamp(
    MIN_TEXT_SCALE,
    MAX_TEXT_SCALE,
    1 / Math.log10(Math.max(distance, 0.001)) // Avoid log(0)
  );

  // round to 2 decimal places for cleaner output
  return distance * scaleFactor;
}

// preprocess waypoints to memoize calculations
const processedWaypoints = computed(() => {
  if (!arStage.value) return [];
  return arStage.value.waypoints.map((waypoint, index) => {
    const distance = calculateDistanceInMeters(waypoint);
    const scale = calcTextScale(distance);
    const textLength = waypoint.text[props.locale]?.length || 0;
    const width = 0.15 * (textLength + 2); // width based on text length
    return {
      ...waypoint,
      id: index,
      distance,
      scale,
      value: waypoint.text[props.locale],
      placeString: formatLocation(waypoint.location),
      scaleString: `${scale} ${scale} ${scale}`,
      geometryString: `primitive: plane; width: ${width}; height: 0.4;`,
      zOffset: Z_FIGHTING_OFFSET * scale, // prevent flicker
    };
  });
});

onMounted(async () => {
  try {
    const response = await axios.get<Tour>(`/api/tour/${props.tourId}`);
    tour.value = response.data;
  } catch (error) {
    console.error("Failed to load tour data:", error);
  }
});
</script>

<style scoped>
.ar-embed {
  width: 100%;
  height: 100%;
}
</style>
