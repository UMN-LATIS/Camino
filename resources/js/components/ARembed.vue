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
        :position="w.positionString"
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
const Z_FIGHTING_OFFSET = 0.01; // prevent flickering
const MIN_TEXT_SCALE = 0.03; // minimum visible scale for far distances
const MAX_TEXT_SCALE = 3;
const BASE_TEXT_SCALE = 1; // text scale at 1 meter

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

// scale text size so it's readable (but smaller) at greater distances
function calcTextScale(distance: number): number {
  // 1m away = BASE_SCALE,
  // 10m away = BASE_SCALE * 0.5
  // 100m away = BASE_SCALE * 0.25
  // 1km away = BASE_SCALE * 0.125
  // distance away = BASE_SCALE * (0.5 ^ log10(distance))
  const minDistance = Math.max(distance, 1); // prevent log(0)
  const scale = BASE_TEXT_SCALE * Math.pow(0.5, Math.log10(minDistance));
  return clamp(MIN_TEXT_SCALE, MAX_TEXT_SCALE, scale) * distance;
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
      positionString: `0 ${waypoint.altitude ?? 0} 0`,
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
