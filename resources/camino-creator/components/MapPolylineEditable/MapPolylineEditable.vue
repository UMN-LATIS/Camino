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
import type { LngLat } from "@/types";
import { toGeoJsonLineString } from "@/camino-trekker/components/MapPolyline/toGeoJson";
import * as MapboxDrawWaypoint from "mapbox-gl-draw-waypoint";
import { Feature, LineString } from "geojson";
import editablePolylineStyles from "./editablePolylineStyles";
import lngLatEquals from "@/shared/lngLatEquals";

/** Editable polyline locked between two derived endpoints; emits interior-only `waypoints`. */
interface Props {
  startPoint: LngLat;
  waypoints: LngLat[];
  endPoint: LngLat;
  id: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (eventName: "update:waypoints", waypoints: LngLat[]);
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

// Seed a draggable midpoint when route is empty; rendered only, never emitted.
const midpoint = computed(
  (): LngLat => ({
    lng: (props.startPoint.lng + props.endPoint.lng) / 2,
    lat: (props.startPoint.lat + props.endPoint.lat) / 2,
  }),
);

const renderedInterior = computed((): LngLat[] =>
  props.waypoints.length ? props.waypoints : [midpoint.value],
);

function toLngLats(geojson: Feature<LineString>): LngLat[] {
  return geojson.geometry.coordinates.map((coord) => ({
    lng: coord[0],
    lat: coord[1],
  }));
}

function drawnLineMatches(desired: LngLat[]): boolean {
  const features = draw.getAll().features;
  if (features.length !== 1) return false;
  const current = toLngLats(features[0] as Feature<LineString>);
  if (current.length !== desired.length) return false;
  return current.every((point, i) => lngLatEquals(point, desired[i]));
}

function renderLine() {
  if (!isReady.value || !map?.value) return;

  const desired = [props.startPoint, ...renderedInterior.value, props.endPoint];

  // When the parent echoes back waypoints we just emitted, the draw feature
  // already reflects this state — rebuilding it tears down direct_select's
  // internal state mid-interaction and is what leaves `dragPan` disabled.
  if (!drawnLineMatches(desired)) {
    draw.deleteAll();
    draw.add(toGeoJsonLineString(desired));
    // direct_select shows vertex handles and prevents whole-line dragging.
    draw.changeMode("direct_select", {
      featureId: draw.getAll().features[0].id as string,
    });
  }

  // mapbox-gl-draw's direct_select can leave map.dragPan disabled when its
  // mousedown→stopDragging contract is broken (e.g. clicking the line, or
  // re-rendering the feature between mousedown and mouseup). Re-enable here
  // so the symptom can't persist past a render.
  map.value.dragPan.enable();
}

function handleUpdate(event: MapboxDraw.DrawUpdateEvent) {
  if (event.action !== "change_coordinates") return;

  const linestrings = event.features as Feature<LineString>[];
  const drawnLine = toLngLats(linestrings[0]);
  const sandwiched = [props.startPoint, ...drawnLine, props.endPoint];
  const deduped = sandwiched.filter(
    (point, i) => i === 0 || !lngLatEquals(point, sandwiched[i - 1]),
  );
  emit("update:waypoints", deduped.slice(1, -1));
}

function initDrawOnMapLoad() {
  const unwatch = watch([map], () => {
    if (!map) return;
    map.value.addControl(draw);
    map.value.on("draw.update", handleUpdate);
    // Catches cases where direct_select disabled dragPan on mousedown
    // (e.g. clicking a vertex without dragging) and the matching
    // stopDragging never ran. Registered after addControl so it fires
    // after mapbox-gl-draw's own mouseup handling.
    map.value.on("mouseup", () => map.value?.dragPan.enable());
    isReady.value = true;

    unwatch();
  });
}

watch(
  [
    () => props.startPoint,
    () => props.endPoint,
    () => props.waypoints,
    isReady,
  ],
  () => {
    renderLine();
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  initDrawOnMapLoad();
});
</script>
