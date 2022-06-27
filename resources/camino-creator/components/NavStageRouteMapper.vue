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

      <div v-for="otherStop in otherStops" :key="otherStop.id">
        <MapPolyline
          :id="`otherStopRoute-${otherStop.id}`"
          :positions="otherStop.route || []"
          color="#bbb"
        />
        <MapMarker
          v-if="otherStop.targetPoint"
          :lng="otherStop.targetPoint.lng"
          :lat="otherStop.targetPoint.lat"
          color="#bbb"
        >
          <MapMarkerLabel
            :variant="getMapMarkerVariant(otherStop.index, currentStop?.index)"
            >{{ otherStop.index + 1 }}</MapMarkerLabel
          >
        </MapMarker>
      </div>

      <!-- Current Stop Target (Editable)-->
      <MapMarker
        :lng="currentValuedTargetPoint.lng"
        :lat="currentValuedTargetPoint.lat"
        color="#f00"
        :draggable="true"
        @drag="handleMapMarkerDrag"
      >
        <MapMarkerLabel v-if="currentStop" variant="pink">
          {{ currentStop?.index + 1 }}
        </MapMarkerLabel>
      </MapMarker>

      <!-- Dotted line between current stop target and next route -->
      <MapPolyline
        v-if="routeToNextRoute"
        id="route-to-next-route"
        :positions="routeToNextRoute"
        color="#bbb"
        variant="dashed"
      />

      <!-- Current Stop Route (Editable) -->
      <MapPolylineEditable
        v-if="route"
        id="current-stop-route"
        :startPoint="lastValuedTargetPoint"
        :route="route"
        :endPoint="currentValuedTargetPoint"
        @update:route="(route: LngLat[]) => $emit('update:route', route)"
      />
    </Map>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import useConfig from "@/shared/useConfig";
import { Map as MapboxMap } from "mapbox-gl";
import { LngLat, Maybe, TourStopRoute } from "@/types";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Map from "@trekker/components/Map/Map.vue";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";
import MapMarkerLabel from "@/camino-trekker/components/MapMarkerLabel/MapMarkerLabel.vue";
import MapPolyline from "@/camino-trekker/components/MapPolyline/MapPolyline.vue";
import MapPolylineEditable from "@/camino-trekker/components/MapPolylineEditable/MapPolylineEditable.vue";

const props = defineProps<{
  tourId: number;
  stopId: number;
  route: Maybe<LngLat[]>;
  targetPoint: Maybe<LngLat>;
}>();

const emit = defineEmits<{
  (eventName: "update:targetPoint", lnglat: LngLat);
  (eventName: "update:route", route: LngLat[]);
}>();

const store = useCreatorStore();
const config = useConfig();
const mapRef = ref<MapboxMap | null>(null);
const tour = store.getTour(props.tourId);

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

interface MappedStop {
  id: number;
  index: number;
  targetPoint: Maybe<LngLat>;
  route: Maybe<TourStopRoute>;
  lastValuedTargetPoint?: LngLat;
  currentValuedTargetPoint?: LngLat;
}

const toMappedStop = (stop, index) => ({
  id: stop.id,
  index,
  targetPoint: store.getTourStopTargetPoint(props.tourId, stop.id).value,
  route: store.getTourStopRoute(props.tourId, stop.id).value,
});

const mappedStops = computed((): MappedStop[] =>
  tour.value.stops.map(toMappedStop)
);

const currentStop = computed(
  (): Maybe<MappedStop> =>
    mappedStops.value.find((s) => s.id === props.stopId) ?? null
);

const otherStops = computed((): MappedStop[] =>
  mappedStops.value.filter((stop) => stop.id !== props.stopId)
);

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

function getMapMarkerVariant(
  thisIndex: number,
  currentStopIndex: number | undefined
) {
  if (!currentStopIndex) return "default";
  if (thisIndex === currentStopIndex) return "pink";
  if (thisIndex === currentStopIndex - 1) return "orange";
  return "default";
}
</script>

<style scoped>
.map-container {
  height: 50vh;
}
</style>
