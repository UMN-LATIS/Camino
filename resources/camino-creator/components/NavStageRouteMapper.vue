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
      >
        <MapMarkerLabel>
          <i class="fas fa-star"></i>
        </MapMarkerLabel>
      </MapMarker>

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
    <Alert v-if="geolocationError" class="my-2" variant="warning">
      {{ geolocationError.message }}
    </Alert>
    <div class="route-mapper__button-group d-flex justify-content-end mt-3">
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
import {
  Map as MapboxMap,
  MapLayerEventType,
  MapLayerMouseEvent,
  MapMouseEvent,
} from "mapbox-gl";
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

/**
 * always returns some target point
 * - props.targetPoint, then
 * - last stop's target point offset by a bit
 */
const currentValuedTargetPoint = computed((): LngLat => {
  // use current passed target point
  // which may be different from the store's target point
  // if we haven't saved yet
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

function onMapEvent(
  map: MapboxMap,
  eventName: keyof MapLayerEventType,
  handlerFn: (event: MapLayerMouseEvent) => void,
  options: { ignoreLayerId: string }
) {
  // set up a handler to ignore the layer with the given layer id
  if (options.ignoreLayerId) {
    map.on(eventName, options.ignoreLayerId, (event) => {
      event.originalEvent.preventDefault();
    });
  }

  // now we can check if default was prevented on our event
  // before running the given handler function
  map.on("click", (event) => {
    if (event.originalEvent.defaultPrevented) return;
    handlerFn(event);
  });
}

function handleMapLoad(map: MapboxMap) {
  mapRef.value = map;

  // listen for click events to update the target point,
  // but ignore events that happen on the "gl-draw-polygon-midpoint.cold"
  // layer, since that those clicks will on the midpoint to create a new
  // waypoint on the route line
  onMapEvent(
    map,
    "click",
    (event: MapMouseEvent) =>
      emit("update:targetPoint", {
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
      }),
    { ignoreLayerId: "gl-draw-polygon-midpoint.cold" }
  );
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
  padding: 1rem;
  border-radius: 0.25rem;
}
</style>
