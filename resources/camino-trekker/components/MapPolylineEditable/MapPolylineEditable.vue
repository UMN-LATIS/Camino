<template>
  <slot />
</template>
<script setup lang="ts">
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { watch, inject, onMounted, computed, ref } from "vue";
import { MapInjectionKey } from "@/shared/constants";
import type { LngLat, TourStopRoute } from "@/types";
import { toGeoJsonLineString } from "@/camino-trekker/components/MapPolyline/toGeoJson";
import { fixedEndpointsMode } from "./fixedEndpointMode";

interface Props {
  startPoint: LngLat;
  route: TourStopRoute;
  endPoint: LngLat;
  id: string;
}
const props = defineProps<Props>();
const isReady = ref<boolean>(false);
const map = inject(MapInjectionKey, null);
const draw = new MapboxDraw({
  displayControlsDefault: false,
  modes: {
    ...MapboxDraw.modes,
    fixed_endpoint: fixedEndpointsMode as unknown as MapboxDraw.DrawCustomMode,
  },
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

  // if any line features exist, remove them
  draw.deleteAll();

  const lineFeature = toGeoJsonLineString([
    props.startPoint,
    ...routeOrMidpoint.value,
    props.endPoint,
  ]);
  const featureIds = draw.add(lineFeature);
  console.log({ featureIds });
  draw.changeMode("direct_select", {
    featureId: featureIds[0],
  });
}

function initDrawOnMapLoad() {
  const unwatch = watch([map], () => {
    if (!map) return;
    map.value.addControl(draw);
    isReady.value = true;
    unwatch();
  });
}

watch([isReady, () => props.endPoint], () => {
  console.log("rendering line");
  renderLine();
});

onMounted(() => {
  initDrawOnMapLoad();
});
</script>
