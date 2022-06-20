<template>
  <div>
    <div ref="mapContainerRef" class="map-container" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, toRefs, provide } from "vue";
import { useResizeObserver } from "@vueuse/core";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  FullscreenControl,
  GeolocateControl,
  ScaleControl,
} from "mapbox-gl";
import type { LngLat, BoundingBox, Maybe } from "@/types";
import { MapInjectionKey } from "@/shared/constants";

interface Props {
  center: LngLat;
  zoom: number;
  bounds: BoundingBox;
  mapStyle: string;
  accessToken: string;
}

const props = defineProps<Props>();

const mapContainerRef = ref<HTMLDivElement>();
const mapRef = ref<Maybe<Map>>(null);

const {
  center: centerRef,
  zoom: zoomRef,
  bounds: boundsRef,
  mapStyle: mapStyleRef,
} = toRefs(props);

const MAP_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v11",
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
  satellite: "mapbox://styles/mapbox/satellite-streets-v11",
  "navigation-day": "mapbox://styles/mapbox/navigation-day-v1",
  "navigation-night": "mapbox://styles/mapbox/navigation-night-v1",
};

// satellite gets a bit too pixelated up close
const getMaxZoomForStyle = (mapStyle) => (mapStyle === "satellite" ? 18 : 22);

// watch style changes
watch(mapStyleRef, () => {
  if (!mapRef.value) return;

  const mapStyle = mapStyleRef.value;
  mapRef.value.setStyle(MAP_STYLES[mapStyle]);
  mapRef.value.setMaxZoom(getMaxZoomForStyle(mapStyle));
});

// watch map bounds changes
watch(boundsRef, () => {
  if (!mapRef.value) return;

  mapRef.value.fitBounds(boundsRef.value, { padding: 64 });
});

onMounted(() => {
  if (!mapContainerRef.value) {
    throw Error(
      "Cannot create Map: container not defined:",
      mapContainerRef.value
    );
  }

  mapRef.value = new Map({
    container: mapContainerRef.value,
    style: MAP_STYLES[props.mapStyle],
    center: [centerRef.value.lng, centerRef.value.lat],
    zoom: zoomRef.value,
    accessToken: props.accessToken,
    maxZoom: getMaxZoomForStyle(props.mapStyle),
  });

  mapRef.value
    .addControl(new FullscreenControl())
    .addControl(new GeolocateControl())
    .addControl(new ScaleControl({ unit: "imperial" }));

  if (props.bounds) {
    mapRef.value.fitBounds(boundsRef.value, { padding: 64 });
  }

  useResizeObserver(mapContainerRef, () => {
    if (!mapRef.value) return;
    mapRef.value.resize();
  });
});

provide(MapInjectionKey, mapRef);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
