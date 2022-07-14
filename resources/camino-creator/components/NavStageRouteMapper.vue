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
      <div v-for="stop in otherStops" v-once :key="stop.id">
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
          <MapMarkerLabel>
            {{ stop.index + 1 }}
          </MapMarkerLabel>
        </MapMarker>
      </div>

      <!-- Tour Start Location -->
      <MapMarker
        v-if="tour.start_location"
        :lng="tour.start_location.lng"
        :lat="tour.start_location.lat"
      >
        <!-- 
          If no previousStop exists, then the start point is the
          previous stop so color it orange 
        -->
        <MapMarkerLabel :color="!previousStop ? 'orange' : 'default'">
          <i class="fas fa-star"></i>
        </MapMarkerLabel>
      </MapMarker>

      <!-- Previous Stop Target-->
      <MapMarker
        v-if="previousStop && previousStop.targetPoint"
        :lng="previousStop.targetPoint.lng"
        :lat="previousStop.targetPoint.lat"
        @drag="handleMapMarkerDrag"
      >
        <MapMarkerLabel color="orange">
          {{ previousStop.index + 1 }}
        </MapMarkerLabel>
      </MapMarker>

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

      <!-- 
        Draw a dotted line between current stop target and next route 
        to indicate the change
      -->
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
    <Alert v-if="geolocationError" class="my-2" variant="warning">
      {{ geolocationError.message }}
    </Alert>
    <div class="route-mapper__button-group d-flex justify-content-end p-3">
      <BButton variant="tertiary" @click="$emit('update:route', [])"
        >Clear Route</BButton
      >
      <BButton variant="tertiary" @click="handleClearTargetPoint"
        >Clear Target Point</BButton
      >
      <BButton @click="handleUseCurrentLocation">Use Current Location</BButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
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
import { useGeolocation } from "@vueuse/core";
import Alert from "./Alert.vue";
import getOffsetPointFrom from "@/shared/getOffsetPointFrom";

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
const { coords: geolocationCoords, error: geolocationError } = useGeolocation();

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

const currentValuedTargetPoint = computed((): LngLat => {
  return props.targetPoint ?? offsetPointFromLastTarget.value;
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

const previousStop = computed((): Maybe<MappedStop> => {
  const currentStopIndex = currentStop.value?.index;
  if (!currentStopIndex) return null;
  return (
    mappedStops.value.find((s) => s.index === currentStopIndex - 1) ?? null
  );
});

// calculate this once on mount
const otherStops = computed((): MappedStop[] => {
  if (otherStops.value?.length) return otherStops.value;
  return mappedStops.value.filter((stop) => stop.id !== props.stopId);
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

function flyTo(lnglat: LngLat) {
  if (!mapRef.value) return;
  mapRef.value.flyTo({
    center: {
      lon: lnglat.lng,
      lat: lnglat.lat,
    },
  });
}

function handleMapMarkerDrag(coords: LngLat) {
  emit("update:targetPoint", {
    lng: coords.lng,
    lat: coords.lat,
  });
  nextTick(() => flyTo(coords));
}

function handleClearTargetPoint() {
  const resetTargetPoint = offsetPointFromLastTarget.value;
  emit("update:targetPoint", resetTargetPoint);
  nextTick(() => flyTo(resetTargetPoint));
}

function handleUseCurrentLocation() {
  if (geolocationError.value) {
    return;
  }
  const currentLocation = {
    lng: geolocationCoords.value.longitude,
    lat: geolocationCoords.value.latitude,
  };
  emit("update:targetPoint", currentLocation);
  nextTick(() => flyTo(currentLocation));
}
</script>

<style scoped>
.map-container {
  height: 50vh;
}
.route-mapper {
  background: #f3f3f3;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
