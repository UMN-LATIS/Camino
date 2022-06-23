<template>
  <div>
    <BButton
      data-bs-toggle="modal"
      data-bs-target="#setLocation"
      @click="isModalOpen = !isModalOpen"
      ><i class="fas fa-map-marker-alt"></i> Set Location</BButton
    >

    <BModal
      v-show="isModalOpen"
      id="setLocation"
      title="Set Location"
      @close="isModalOpen = false"
    >
      <Map
        class="map-container"
        :center="location"
        :zoom="16"
        mapStyle="streets"
        :accessToken="config.mapBox.accessToken"
        @click="handleMapClick"
        @load="handleMapLoad"
      >
        <MapMarker
          v-if="location"
          :lng="location.lng"
          :lat="location.lat"
          color="#f00"
        />
      </Map>
      <template #footer>
        <Alert v-if="!isLocationAvailable" variant="warning">
          Your current location is unavailable. Check your browser settings.
        </Alert>
        <div
          class="d-flex flex-direction-row-reverse gap-1 justify-content-between w-100"
        >
          <BButton
            :disabled="!isLocationAvailable"
            @click="handleUseCurrentLocation"
            >Use Current Location</BButton
          >
          <BButton
            variant="primary"
            data-bs-dismiss="modal"
            @click="isModalOpen = false"
            >Done
          </BButton>
        </div>
      </template>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useGeolocation } from "@vueuse/core";
import BButton from "./BButton.vue";
import BModal from "./BModal.vue";
import Alert from "./Alert.vue";
import type { LngLat, CustomBaseMap, Maybe } from "@/types";
import Map from "@/camino-trekker/components/Map/Map.vue";
import useConfig from "@/shared/useConfig";
import MapMarker from "@/camino-trekker/components/MapMarker/MapMarker.vue";
import { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";

defineProps<{
  location: Maybe<LngLat>;
  basemap?: Maybe<CustomBaseMap>;
}>();

const emit = defineEmits<{
  (eventName: "update:location", targetPoint: LngLat);
  (eventName: "update:route", route: LngLat[]);
}>();

const mapRef = ref<MapboxMap | null>(null);
const isModalOpen = ref<boolean>(false);
const config = useConfig();

// Geolocation computed vars
const { coords, error: geolocationError } = useGeolocation();
const isLocationAvailable = computed((): boolean => !geolocationError.value);
const currentLocation = computed(
  (): LngLat => ({
    lng: coords.value.longitude,
    lat: coords.value.latitude,
  })
);

function handleMapLoad(map: MapboxMap) {
  mapRef.value = map;
}

function handleUseCurrentLocation() {
  if (!mapRef.value) return;

  emit("update:location", currentLocation.value);

  mapRef.value.flyTo({
    center: [currentLocation.value.lng, currentLocation.value.lat],
  });
}

function handleMapClick(event: MapMouseEvent) {
  emit("update:location", {
    lng: event.lngLat.lng,
    lat: event.lngLat.lat,
  });
}
</script>

<style scoped>
.map-container {
  height: 70vh;
}
</style>
