<template>
  <div class="route-mapper">
    <Map
      class="map-container"
      :center="currentValuedTargetPoint"
      :zoom="16"
      mapStyle="streets"
      :accessToken="config.mapBox.accessToken"
      @load="handleMapLoad"
    >
      <!-- Tour Start Location -->
      <MapMarker
        v-if="tour.start_location"
        :lng="tour.start_location.lng"
        :lat="tour.start_location.lat"
        color="green"
      />

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
        :lng="currentValuedTargetPoint.lng"
        :lat="currentValuedTargetPoint.lat"
        color="#f00"
        :draggable="true"
        @drag="handleMapMarkerDrag"
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
      <MapPolylineEditable
        v-if="route"
        id="current-stop-route"
        :startPoint="lastValuedTargetPoint"
        :route="route"
        :endPoint="currentValuedTargetPoint"
      />
    </Map>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import Map from "@trekker/components/Map/Map.vue";
import MapPolyline from "@/camino-trekker/components/MapPolyline/MapPolyline.vue";
import useConfig from "@/shared/useConfig";
import { Map as MapboxMap } from "mapbox-gl";
import { LngLat, Maybe, TourStopRoute } from "@/types";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";
import MapPolylineEditable from "@/camino-trekker/components/MapPolylineEditable/MapPolylineEditable.vue";

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
const mapRef = ref<MapboxMap | null>(null);
const config = useConfig();

/**
 * last target point set before this stop
 */
const lastValuedTargetPoint = computed((): LngLat => {
  const prevStop = store.getPrevTourStop(props.tourId, props.stopId).value;
  return store.findValuedTargetPoint(props.tourId, prevStop?.id).value;
});

/**
 * always returns some target point
 * - props.targetPoint, then
 * - next stop's route start point, then
 * - last stop's target point offset by a bit
 */
const currentValuedTargetPoint = computed((): LngLat => {
  // use current passed target point
  // which may be different from the store's target point
  // if we haven't saved yet
  return (
    props.targetPoint ??
    store.getNextTourStopStartPoint(props.tourId, props.stopId).value ??
    getOffsetPointFrom(lastValuedTargetPoint.value)
  );
});

// RENDER OTHER STOPS and ROUTES
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

function getOffsetPointFrom(pt: LngLat) {
  const offset = 0.0005;
  return {
    lng: pt.lng + offset,
    lat: pt.lat + offset,
  };
}

function handleMapLoad(map: MapboxMap) {
  mapRef.value = map;
}

function handleMapMarkerDrag(coords: LngLat) {
  emit("update:targetPoint", {
    lng: coords.lng,
    lat: coords.lat,
  });
}
</script>

<style scoped>
.map-container {
  height: 50vh;
}
</style>
