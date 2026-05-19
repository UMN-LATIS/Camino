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
import stripAnchors from "./stripAnchors";

/**
 * An editable polyline anchored between two derived endpoints
 * (`startPoint` and `endPoint`). The user can add, drag, or remove
 * interior `waypoints`; the endpoints themselves are locked by
 * mapbox-gl-draw-waypoint.
 *
 * The contract is interior-only. `update:waypoints` emits the
 * waypoints between the anchors — never the anchors themselves.
 * Callers don't need to slice or bookend the emitted array.
 */
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

// When there are no waypoints, seed a single midpoint vertex so
// the user has something draggable to start sketching with. This
// seed is rendered but not stored — only the user's edits make it
// into the emitted waypoint list.
const midpoint = computed(
  (): LngLat => ({
    lng: (props.startPoint.lng + props.endPoint.lng) / 2,
    lat: (props.startPoint.lat + props.endPoint.lat) / 2,
  }),
);

const renderedInterior = computed((): LngLat[] =>
  props.waypoints.length ? props.waypoints : [midpoint.value],
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

  // direct_select mode shows vertex handles and prevents dragging
  // the whole line as a single object.
  draw.changeMode("direct_select", {
    featureId: draw.getAll().features[0].id as string,
  });

  hideEndAnchorAndAdjacentMidpoint();
}

/**
 * Hides the END anchor vertex and the phantom midpoint between the
 * last interior vertex and that anchor. The START anchor and its
 * adjacent midpoint are filtered out statically in
 * editablePolylineStyles (coord_path == "0"); the end-side
 * coord_paths depend on waypoint count so we update the filters
 * here after every render.
 */
function hideEndAnchorAndAdjacentMidpoint() {
  if (!map?.value) return;
  const mapboxMap = map.value;
  const lastVertexIdx = String(renderedInterior.value.length + 1);
  const lastMidpointIdx = String(renderedInterior.value.length);

  const vertexLayers = [
    "gl-draw-polygon-and-line-vertex-stroke-inactive",
    "gl-draw-polygon-and-line-vertex-inactive",
  ];
  for (const layerId of vertexLayers) {
    if (!mapboxMap.getLayer(layerId)) continue;
    mapboxMap.setFilter(layerId, [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
      ["!=", "coord_path", "0"],
      ["!=", "coord_path", lastVertexIdx],
    ]);
  }

  const midpointLayer = "gl-draw-polygon-midpoint";
  if (mapboxMap.getLayer(midpointLayer)) {
    mapboxMap.setFilter(midpointLayer, [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "midpoint"],
      ["!=", "coord_path", "0"],
      ["!=", "coord_path", lastMidpointIdx],
    ]);
  }
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
  emit(
    "update:waypoints",
    stripAnchors(drawnLine, props.startPoint, props.endPoint),
  );
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
