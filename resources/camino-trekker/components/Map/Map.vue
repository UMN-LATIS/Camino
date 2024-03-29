<template>
  <div class="mapbox-map">
    <div ref="mapContainerRef" class="map-container" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, provide } from "vue";
import { useResizeObserver } from "@vueuse/core";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map as MapboxMap,
  FullscreenControl,
  GeolocateControl,
  ScaleControl,
  MapMouseEvent,
} from "mapbox-gl";
import type { LngLat, BoundingBox, Maybe } from "@/types";
import { MapInjectionKey } from "@/shared/constants";

const MAP_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v11",
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
  satellite: "mapbox://styles/mapbox/satellite-streets-v11",
  "navigation-day": "mapbox://styles/mapbox/navigation-day-v1",
  "navigation-night": "mapbox://styles/mapbox/navigation-night-v1",
};

const props = defineProps<{
  center: Maybe<LngLat>;
  zoom: number;
  bounds?: Maybe<BoundingBox>;
  mapStyle: keyof typeof MAP_STYLES;
  accessToken: string;
}>();

const emit = defineEmits<{
  (eventName: "click", mapMouseEvent: MapMouseEvent, mapboxMap: MapboxMap);
  (eventName: "load", mapboxMap: MapboxMap);
}>();

const mapContainerRef = ref<HTMLDivElement>();
const mapRef = ref<Maybe<MapboxMap>>(null);

// satellite gets a bit too pixelated up close
const getMaxZoomForStyle = (mapStyle) => (mapStyle === "satellite" ? 18 : 20);

// watch style changes
watch(
  () => props.mapStyle,
  () => {
    if (!mapRef.value) return;
    mapRef.value.setStyle(MAP_STYLES[props.mapStyle]);
    mapRef.value.setMaxZoom(getMaxZoomForStyle(props.mapStyle));
  }
);

// watch map bounds changes
watch([() => props.bounds, mapRef], () => {
  if (!mapRef.value || !props.bounds) return;
  mapRef.value.fitBounds(props.bounds, { padding: 64 });
});

onMounted(() => {
  if (!mapContainerRef.value) {
    throw Error(
      "Cannot create Map: container not defined:",
      mapContainerRef.value
    );
  }

  mapRef.value = new MapboxMap({
    container: mapContainerRef.value,
    style: MAP_STYLES[props.mapStyle],
    center: props.center ? [props.center.lng, props.center.lat] : undefined,
    zoom: props.zoom,
    accessToken: props.accessToken,
    maxZoom: getMaxZoomForStyle(props.mapStyle),
  });

  mapRef.value
    .addControl(new FullscreenControl())
    .addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    )
    .addControl(new ScaleControl({ unit: "imperial" }));

  if (props.bounds) {
    mapRef.value.fitBounds(props.bounds, { padding: 64 });
  }

  // add click handler
  mapRef.value.on("click", (event: MapMouseEvent) => {
    if (!mapRef.value) {
      // this shouldn't happen
      throw new Error("there was a click but no map");
    }

    emit("click", event, mapRef.value);
  });

  mapRef.value.on("load", () => {
    if (!mapRef.value) {
      throw new Error("cannot emit load event: no mapRef");
    }
    emit("load", mapRef.value);
  });

  useResizeObserver(mapContainerRef, () => {
    if (!mapRef.value) return;
    mapRef.value.resize();
  });
});

provide(MapInjectionKey, mapRef);
</script>

<style scoped>
.mapbox-map,
.map-container {
  width: 100%;
  height: 100%;
}
</style>
