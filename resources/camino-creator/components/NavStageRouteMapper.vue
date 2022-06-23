<template>
  <div class="route-mapper">
    <Map
      class="map-container"
      :center="mapCenter"
      :zoom="16"
      mapStyle="streets"
      :accessToken="config.mapBox.accessToken"
      @load="handleMapLoad"
      @click="handleMapClick"
    >
      <!-- Other Stop Routes -->
      <div v-for="(otherStopRoute, index) in otherStopRoutes" :key="index">
        <MapPolyline
          :id="`otherStopRoute-${index}`"
          :positions="otherStopRoute || []"
          color="#999"
        />
      </div>

      <!-- Other Stop Targets -->
      <div v-for="(pt, index) in otherStopTargetPoints" :key="index">
        <MapMarker v-if="pt" :lng="pt.lng" :lat="pt.lat" color="#777" />
      </div>

      <!-- Current Stop Target (Editable)-->
      <MapMarker
        v-if="targetPoint"
        :lng="targetPoint.lng"
        :lat="targetPoint.lat"
        color="#f00"
      />

      <!-- Dotted line between current stop target and next route -->
      <MapPolyline
        v-if="routeToNextRoute"
        id="route-to-next-route"
        :positions="routeToNextRoute"
        color="red"
        variant="dashed"
      />

      <!-- Current Stop Route (Editable) -->
    </Map>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import Map from "@trekker/components/Map/Map.vue";
import MapPolyline from "@/camino-trekker/components/MapPolyline/MapPolyline.vue";
import useConfig from "@/shared/useConfig";
import { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import { LngLat, Maybe, TourStopRoute } from "@/types";
import { findLastTargetPoint } from "@/camino-trekker/utils/findLastTargetPoint";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";

interface Props {
  tourId: number;
  stopId: number;
  route: Maybe<LngLat[]>;
  targetPoint: Maybe<LngLat>;
}

const props = defineProps<Props>();

interface Emits {
  (eventName: "update:targetPoint", lnglat: LngLat);
  (eventName: "update:route", route: LngLat[]);
}

const emit = defineEmits<Emits>();

const store = useCreatorStore();
const tour = store.getTour(props.tourId);
// const stop: ComputedRef<TourStop> = store.getTourStop(
//   props.tourId,
//   props.stopId
// );
const tourAndStopIndex = store.getTourAndStopIndex(props.tourId, props.stopId);
const mapRef = ref<MapboxMap | null>(null);
const config = useConfig();

const idsForOtherStops = computed((): number[] =>
  tour.value.stops.map((s) => s.id).filter((stopId) => stopId !== props.stopId)
);

const otherStopRoutes = computed((): Maybe<TourStopRoute>[] => {
  return idsForOtherStops.value.map(
    (otherStopId) => store.getTourStopRoute(props.tourId, otherStopId).value
  );
});

const otherStopTargetPoints = computed((): Maybe<LngLat>[] => {
  return idsForOtherStops.value.map(
    (otherStopId) =>
      store.getTourStopTargetPoint(props.tourId, otherStopId).value
  );
});

const mapCenter = computed((): LngLat => {
  // use the targetPoint if we have it
  // otherwise find most recent targetPoint starting at index
  return (
    props.targetPoint ||
    findLastTargetPoint(tour.value, tourAndStopIndex.value.stopIndex)
  );
});

const routeToNextRoute = computed((): Maybe<TourStopRoute> => {
  if (!props.targetPoint) return null;

  const currentState = store.getState();
  const nextStop = store.selectNextTourStop(
    currentState,
    props.tourId,
    props.stopId
  );

  if (!nextStop) return null;
  const nextStopRoute = store.selectTourStopRoute(
    currentState,
    props.tourId,
    nextStop.id
  );

  if (!nextStopRoute || !nextStopRoute.length) {
    return null;
  }

  const routeToRoute = [props.targetPoint, nextStopRoute[0]];
  return routeToRoute;
});

function handleMapLoad(map: MapboxMap) {
  mapRef.value = map;
}

function handleMapClick(event: MapMouseEvent) {
  emit("update:targetPoint", {
    lng: event.lngLat.lng,
    lat: event.lngLat.lat,
  });
}
</script>

<style scoped>
.map-container {
  height: 50vh;
}
</style>
