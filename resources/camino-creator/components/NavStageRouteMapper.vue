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
      />

      <div v-for="stop in otherStops" :key="stop.id">
        <MapPolyline
          :id="`otherStopRoute-${stop.id}`"
          :positions="stop.route || []"
          :variant="
            currentStop?.index === stop.index
              ? 'gradient-active'
              : 'gradient-inactive'
          "
        />
        <MapMarker
          v-if="stop.targetPoint"
          :lng="stop.targetPoint.lng"
          :lat="stop.targetPoint.lat"
        >
          <!-- -->
          <MapMarkerLabel
            :pulse="currentStop ? currentStop.index - 1 === stop.index : false"
          >
            {{ stop.index + 1 }}
          </MapMarkerLabel>
        </MapMarker>
      </div>

      <!-- Current Stop Target (Editable)-->
      <MapMarker
        :lng="currentValuedTargetPoint.lng"
        :lat="currentValuedTargetPoint.lat"
        :draggable="true"
        :active="true"
        @drag="handleMapMarkerDrag"
      >
        <MapMarkerLabel v-if="currentStop" color="pink" :pulse="true">
          {{ currentStop?.index + 1 }}
        </MapMarkerLabel>
      </MapMarker>

      <!-- Dotted line between current stop target and next route -->
      <MapPolyline
        v-if="routeToNextRoute"
        id="route-to-next-route"
        :positions="routeToNextRoute"
        color="#ccc"
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
    <BButton @click="$emit('update:route', [])">Clear Route</BButton>
    <BButton
      @click="
        () => {
          $emit('update:targetPoint', offsetPointFromLastTarget);
          $emit('update:route', []);
        }
      "
      >Clear Target Point</BButton
    >
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
import BButton from "./BButton.vue";

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

const offsetPointFromLastTarget = computed(
  (): LngLat => getOffsetPointFrom(lastValuedTargetPoint.value)
);

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
    offsetPointFromLastTarget.value
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
</script>

<style scoped>
.map-container {
  height: 50vh;
}
</style>
