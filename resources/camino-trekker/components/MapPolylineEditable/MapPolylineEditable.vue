<template>
  <slot />
</template>
<script setup lang="ts">
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { watch, inject, onMounted, computed } from "vue";
import { MapInjectionKey } from "@/shared/constants";
import type { LngLat, TourStopRoute } from "@/types";
import { toGeoJsonLineString } from "@/camino-trekker/components/MapPolyline/toGeoJson";

const map = inject(MapInjectionKey, null);

interface Props {
  startPoint: LngLat;
  route: TourStopRoute;
  endPoint: LngLat;
  id: string;
}
const props = defineProps<Props>();

const draw = new MapboxDraw({});
const midpoint = computed(
  (): LngLat => ({
    lng: (props.startPoint.lng + props.endPoint.lng) / 2,
    lat: (props.startPoint.lat + props.endPoint.lat) / 2,
  })
);

const routeOrMidpoint = computed((): LngLat[] =>
  props.route.length ? props.route : [midpoint.value]
);

const lineFeature = toGeoJsonLineString([
  props.startPoint,
  ...routeOrMidpoint.value,
  props.endPoint,
]);

function initDrawOnMapLoad() {
  const unwatch = watch([map], () => {
    if (!map) return;
    map.value.addControl(draw);
    draw.add(lineFeature.geometry);

    // remove this watcher
    unwatch();
  });
}

onMounted(() => {
  initDrawOnMapLoad();
});
</script>
