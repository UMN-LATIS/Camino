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

      <!-- Tour start; not editable here (InitialLocation owns it). -->
      <MapMarker
        v-if="tour.start_location"
        :lng="tour.start_location.lng"
        :lat="tour.start_location.lat"
      >
        <MapMarkerLabel color="default">
          <i class="fas fa-star"></i>
        </MapMarkerLabel>
      </MapMarker>

      <!-- Previous stop's target = derived start for this stop; edit it on the previous stop. -->
      <MapMarker
        v-if="previousStop && previousStop.targetPoint"
        :lng="previousStop.targetPoint.lng"
        :lat="previousStop.targetPoint.lat"
      >
        <MapMarkerLabel color="default">
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

      <!-- Current Stop Route (Editable) -->
      <MapPolylineEditable
        id="current-stop-route"
        :startPoint="lastValuedTargetPoint"
        :route="route"
        :endPoint="currentValuedTargetPoint"
        @update:route="(next: LngLat[]) => $emit('update:route', next)"
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
import { ref, computed, nextTick, unref } from "vue";
import useConfig from "@/shared/useConfig";
import { Map as MapboxMap } from "mapbox-gl";
import { LngLat, Maybe, TourStop } from "@/types";
import { getStopRouteByIndex } from "@/shared/tourGeometry";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Map from "@trekker/components/Map/Map.vue";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";
import MapMarkerLabel from "@/camino-trekker/components/MapMarkerLabel/MapMarkerLabel.vue";
import MapPolyline from "@/camino-trekker/components/MapPolyline/MapPolyline.vue";
import MapPolylineEditable from "./MapPolylineEditable/MapPolylineEditable.vue";
import BButton from "./BButton.vue";
import { useGeolocation } from "@vueuse/core";
import Alert from "./Alert.vue";
import getOffsetPointFrom from "@/shared/getOffsetPointFrom";

const props = defineProps<{
  tourId: number;
  stopId: number;
  route: LngLat[];
  targetPoint: Maybe<LngLat>;
}>();

const emit = defineEmits<{
  (eventName: "update:targetPoint", lnglat: LngLat);
  (eventName: "update:route", route: LngLat[]);
}>();

const store = useCreatorStore();
const config = useConfig();
const mapRef = ref<MapboxMap | null>(null);
const { coords: geolocationCoords, error: geolocationError } = useGeolocation();

const lastValuedTargetPoint = computed((): LngLat => {
  const prevStop = store.getPrevTourStop(props.tourId, props.stopId).value;
  return store.findValuedTargetPoint(props.tourId, prevStop?.id).value;
});

const offsetPointFromLastTarget = computed(
  (): LngLat => getOffsetPointFrom(lastValuedTargetPoint.value),
);

const currentValuedTargetPoint = computed((): LngLat => {
  return props.targetPoint ?? offsetPointFromLastTarget.value;
});

interface MappedStop {
  id: number;
  index: number;
  targetPoint: Maybe<LngLat>;
  route: LngLat[];
}

const toMappedStop = (stop: TourStop, index: number): MappedStop => ({
  id: stop.id,
  index,
  targetPoint: store.getTourStopTargetPoint(props.tourId, stop.id).value,
  // Full polyline (start..interior..end) for inactive-stop preview.
  route: getStopRouteByIndex(tour, index),
});

// Snapshot mappedStops at setup time; `computed` would re-render on every
// store mutation when only the active stop's data ever changes here.
const tour = unref(store.getTour(props.tourId));
const mappedStops = tour.stops.map(toMappedStop);

const currentStop = computed(
  (): Maybe<MappedStop> =>
    mappedStops.find((s) => s.id === props.stopId) ?? null,
);

const previousStop = computed((): Maybe<MappedStop> => {
  const currentStopIndex = currentStop.value?.index;
  if (!currentStopIndex) return null;
  return mappedStops.find((s) => s.index === currentStopIndex - 1) ?? null;
});

const otherStops = computed((): MappedStop[] => {
  return mappedStops.filter((stop) => stop.id !== props.stopId);
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
