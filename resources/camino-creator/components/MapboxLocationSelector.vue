<template>
  <div class="mapbox-location-selector">
    <Map
      class="map-container"
      :class="{
        'map-container--is-loaded': mapRef,
      }"
      :center="currentValuedLocation"
      :zoom="16"
      mapStyle="streets"
      :accessToken="config.mapBox.accessToken"
      @load="handleMapLoad"
    >
      <!-- draw tour if tourId is given -->
      <div v-for="stop in tourStops" :key="stop.id">
        <MapPolyline
          :id="`stopRoute-${stop.id}`"
          :positions="stop.route || []"
          variant="gradient-inactive"
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

      <!-- Current Location (Draggable) -->
      <MapMarker
        :lng="currentValuedLocation.lng"
        :lat="currentValuedLocation.lat"
        :draggable="true"
        :active="true"
        @drag="handleMapMarkerDrag"
      >
        <MapMarkerLabel color="pink" :pulse="true">
          <i class="fas fa-star"></i>
        </MapMarkerLabel>
      </MapMarker>
    </Map>
    <Alert v-if="geolocationError" class="my-2" variant="warning">
      {{ geolocationError.message }}
    </Alert>
    <div class="route-mapper__button-group d-flex justify-content-end mt-3">
      <BButton @click="handleUseCurrentLocation">Use Current Location</BButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import useConfig from "@/shared/useConfig";
import { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import { LngLat, Maybe, TourStop, TourStopRoute } from "@/types";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Map from "@trekker/components/Map/Map.vue";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";
import MapMarkerLabel from "@/camino-trekker/components/MapMarkerLabel/MapMarkerLabel.vue";
import MapPolyline from "@/camino-trekker/components/MapPolyline/MapPolyline.vue";
import BButton from "./BButton.vue";
import { useGeolocation } from "@vueuse/core";
import Alert from "./Alert.vue";
import { UMN_LNGLAT } from "@/shared/constants";

const props = withDefaults(
  defineProps<{
    location: Maybe<LngLat>;
    tourId?: Maybe<number>;
  }>(),
  {
    tourId: null,
  }
);

const emit = defineEmits<{
  (eventName: "update:location", lnglat: LngLat);
}>();

const store = useCreatorStore();
const config = useConfig();
const mapRef = ref<MapboxMap | null>(null);
const tour = computed(() =>
  props.tourId ? store.getTour(props.tourId).value : null
);
const { coords: geolocationCoords, error: geolocationError } = useGeolocation();

/**
 * always returns some location
 * - props.location, then
 * - first target point it finds in the given tour offset by a bit,
 * - current location,
 * - default point
 */
const currentValuedLocation = computed((): LngLat => {
  if (props.location) return props.location;

  const nextStartPoint: Maybe<LngLat> = props.tourId
    ? store.getNextTourStopStartPoint(props.tourId, 0).value
    : null;

  if (nextStartPoint) return getOffsetPointFrom(nextStartPoint);

  if (geolocationCoords) {
    return {
      lng: geolocationCoords.value.longitude,
      lat: geolocationCoords.value.latitude,
    };
  }

  return UMN_LNGLAT;
});

interface MappedStop {
  id: number;
  index: number;
  targetPoint: Maybe<LngLat>;
  route: Maybe<TourStopRoute>;
  lastValuedTargetPoint?: LngLat;
  currentValuedTargetPoint?: LngLat;
}

const toMappedStop = (stop: TourStop, index: number): Maybe<MappedStop> => {
  if (!props.tourId) return null;
  return {
    id: stop.id,
    index,
    targetPoint: store.getTourStopTargetPoint(props.tourId, stop.id).value,
    route: store.getTourStopRoute(props.tourId, stop.id).value,
  };
};

const tourStops = computed((): MappedStop[] => {
  if (!tour?.value) return [] as MappedStop[];

  return tour.value.stops
    .map(toMappedStop)
    .filter((x): x is MappedStop => Boolean(x));
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
  map.on("click", (event: MapMouseEvent) => {
    emit("update:location", {
      lng: event.lngLat.lng,
      lat: event.lngLat.lat,
    });
  });
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
  emit("update:location", {
    lng: coords.lng,
    lat: coords.lat,
  });
  nextTick(() => flyTo(coords));
}

function handleUseCurrentLocation() {
  if (geolocationError.value) {
    return;
  }
  const currentLocation = {
    lng: geolocationCoords.value.longitude,
    lat: geolocationCoords.value.latitude,
  };
  emit("update:location", currentLocation);
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
