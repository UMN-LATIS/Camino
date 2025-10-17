<template>
  <div class="map-polyline-editable">
    <slot />
  </div>
</template>
<script setup lang="ts">
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { watch, inject, onMounted, computed, ref } from "vue";
import { MapInjectionKey } from "@/shared/constants";
import type { LngLat, TourStopRoute } from "@/types";
import { toGeoJsonLineString } from "@/camino-trekker/components/MapPolyline/toGeoJson";
import * as MapboxDrawWaypoint from "mapbox-gl-draw-waypoint";
import { Feature, LineString } from "geojson";
import editablePolylineStyles from "./editablePolylineStyles";
import normalizeTourStopRoute from "@/shared/normalizeTourStopRoute";

interface Props {
  startPoint: LngLat;
  route: TourStopRoute;
  endPoint: LngLat;
  id: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (eventName: "update:route", route: LngLat[]);
}>();

const isReady = ref<boolean>(false);
const map = inject(MapInjectionKey, null);

const modes = MapboxDrawWaypoint.enable(MapboxDraw.modes);

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    trash: true,
  },
  modes: {
    ...modes,
  },
  styles: editablePolylineStyles,
});

const midpoint = computed(
  (): LngLat => ({
    lng: (props.startPoint.lng + props.endPoint.lng) / 2,
    lat: (props.startPoint.lat + props.endPoint.lat) / 2,
  })
);

const routeOrMidpoint = computed((): LngLat[] =>
  props.route.length ? props.route : [midpoint.value]
);

function renderLine() {
  if (!isReady.value) return;

  const lineFeature = toGeoJsonLineString([
    props.startPoint,
    ...routeOrMidpoint.value,
    props.endPoint,
  ]);

  // Remove any existing features and create new one
  draw.deleteAll();
  draw.add(lineFeature);

  // Enter direct_select mode to show vertices and prevent moving the whole line
  draw.changeMode("direct_select", {
    featureId: draw.getAll().features[0].id as string,
  });
}

function toLngLats(geojson: Feature<LineString>): LngLat[] {
  return geojson.geometry.coordinates.map((coord) => ({
    lng: coord[0],
    lat: coord[1],
  }));
}

function handleUpdate(event: MapboxDraw.DrawUpdateEvent) {
  if (event.action !== "change_coordinates") return;

  const linestrings = event.features as Feature<LineString>[];
  const route = toLngLats(linestrings[0]);

  emit(
    "update:route",
    normalizeTourStopRoute(props.startPoint, route, props.endPoint)
  );
}

function initDrawOnMapLoad() {
  const unwatch = watch([map], () => {
    if (!map) return;
    map.value.addControl(draw);
    map.value.on("draw.update", handleUpdate);
    isReady.value = true;

    // remove this watch now that we're done
    unwatch();
  });
}

watch(isReady, () => {
  renderLine();
});

onMounted(() => {
  initDrawOnMapLoad();
});
</script>
