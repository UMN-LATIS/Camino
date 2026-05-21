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

/** Editable polyline locked between two derived endpoints; emits interior-only `route`. */
interface Props {
  startPoint: LngLat;
  route: LngLat[];
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

// Seed a draggable midpoint when route is empty; rendered only, never emitted.
const midpoint = computed(
  (): LngLat => ({
    lng: (props.startPoint.lng + props.endPoint.lng) / 2,
    lat: (props.startPoint.lat + props.endPoint.lat) / 2,
  }),
);

const renderedInterior = computed((): LngLat[] =>
  props.route.length ? props.route : [midpoint.value],
);

function renderLine() {
  if (!isReady.value || !map?.value) return;

  const lineFeature = toGeoJsonLineString([
    props.startPoint,
    ...renderedInterior.value,
    props.endPoint,
  ]);

  draw.deleteAll();
  draw.add(lineFeature);

  // direct_select shows vertex handles and prevents whole-line dragging.
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
  const drawnLine = toLngLats(linestrings[0]);
  const sandwiched = [props.startPoint, ...drawnLine, props.endPoint];
  const deduped = sandwiched.filter(
    (point, i) => i === 0 || !lngLatEquals(point, sandwiched[i - 1]),
  );
  emit("update:route", deduped.slice(1, -1));
}

function initDrawOnMapLoad() {
  const unwatch = watch([map], () => {
    if (!map) return;
    map.value.addControl(draw);
    map.value.on("draw.update", handleUpdate);
    isReady.value = true;

    unwatch();
  });
}

watch(
  [() => props.startPoint, () => props.endPoint, () => props.route, isReady],
  () => {
    renderLine();
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  initDrawOnMapLoad();
});
</script>
