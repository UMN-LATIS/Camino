<template>
  <!-- eslint-enable vue/multi-word-component-names -->
  <!-- eslint-disable vue/component-name-in-template-casing -->
  <!-- eslint-disable vue/attribute-hyphenation -->
  <div class="w-full h-full border border-red-500">
    <a-scene v-if="arStage" locar-webcam>
      <a-camera
        id="camera"
        look-controls
        wasd-controls
        locar-camera
        rotation-reader
      />

      <a-text
        v-for="(waypoint, index) in arStage.waypoints"
        :key="index"
        :value="waypoint.text[locale]"
        :locar-entity-place="formatLocation(waypoint.location)"
        color="red"
        align="center"
        :scale="formatScale(waypoint)"
        :geometry="`primitive: plane; width: ${
          0.1 * (waypoint.text[locale].length + 2)
        }; height: 0.3;`"
        material="color: #eee; opacity: 0.6; transparent: true"
        look-at="[camera]"
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
} from "@/types";
import { clamp } from "ramda";

const props = defineProps<{
  stage: string;
  simulateLocation: string;
  locale: string;
  tourId: string;
}>();

// Distance calculation constants
const METERS_PER_DEGREE = 111_139; // avg meters per degree of lat/lng
const DEFAULT_DISTANCE_METERS = 2000; // fallback if no target point available

const tour = ref<Tour | null>(null);

const currentStop = computed(() => {
  if (!tour.value) return null;
  return tour.value.stops[parseInt(props.stage)]?.stop_content;
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
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 3;
  const scaleFactor = clamp(
    MIN_SCALE,
    MAX_SCALE,
    1 / Math.log10(Math.max(distance, 0.001)) // Avoid log(0)
  );
  return distance * scaleFactor;
}

function formatScale(waypoint: Waypoint): string {
  const distance = calculateDistanceInMeters(waypoint);
  const scale = calcTextScale(distance);
  return `${scale} ${scale} ${scale}`;
}

onMounted(async () => {
  try {
    const response = await axios.get<Tour>(`/api/tour/${props.tourId}`);
    tour.value = response.data;
  } catch (error) {
    console.error("Failed to load tour data:", error);
  }
});
</script>

<style scoped></style>
