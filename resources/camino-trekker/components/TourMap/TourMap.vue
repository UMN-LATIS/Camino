<template>
  <div
    class="tour-map"
    :class="`tour-map--${initialMapStyle}`"
    @pointerdown="(evt) => evt.stopPropagation()"
  >
    <div v-if="showMapStyleControl" class="button-bar">
      <Button
        v-for="styleChoice in mapStyleChoices"
        :key="styleChoice"
        class="button-bar__button"
        :class="{
          'button-bar__button--is-active': styleChoice === mapStyle,
        }"
        @click="setMapStyle(styleChoice)"
      >
        {{ capitalize(styleChoice) }}
      </Button>
    </div>
    <MapboxGlMap
      v-if="canCreateMap"
      class="map-sheet__map-container"
      :center="center"
      :zoom="type === 'tour' ? 16 : 10"
      :bounds="bounds"
      :mapStyle="mapStyle"
      :accessToken="config.mapBox.accessToken"
    >
      <div v-for="(stop, i) in mapStops" :key="i" class="map-stop">
        <MapPolyline
          :id="`route-${i}`"
          :key="i"
          :positions="stop.route"
          :color="stop.color"
        />
        <MapMarker
          :key="i"
          :lng="stop.stopPoint.lng"
          :lat="stop.stopPoint.lat"
          :color="stop.color"
          class="tour-map__marker"
          :class="{
            'tour-map__marker--is-active': stop.isActive,
          }"
        >
          <MapPopup>
            <p class="map-popup__stop-number-container">
              <span class="map-popup__stop-number">
                {{ stop.number }}
              </span>
            </p>
            <h2 class="map-popup__stop-title">
              {{ stop.title }}
            </h2>
            <p class="map-popup__link-container">
              <router-link :to="stop.href" class="map-popup__link">
                <span class="material-icons">arrow_forward</span>
                <span class="sr-only">Go to Stop</span>
              </router-link>
            </p>
          </MapPopup>
        </MapMarker>
      </div>
    </MapboxGlMap>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import MapboxGlMap from "../Map/Map.vue";
import MapPolyline from "../MapPolyline/MapPolyline.vue";
import MapMarker from "../MapMarker/MapMarker.vue";
import MapPopup from "../MapPopup/MapPopup.vue";
import Button from "../Button/Button.vue";
import capitalize from "../../utils/capitalize";
import getBoundingBox from "../../utils/getBoundingBox";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import config from "@trekker/config";
import { getStopPointAtIndex } from "@/camino-trekker/utils/getStopPointAtIndex";
import { BoundingBox, LngLat } from "@/types";
import { getStopRouteAtIndex } from "@/camino-trekker/utils/getStopRouteAtIndex";
import { getCenterOfBoundingBox } from "@trekker/utils/getCenterOfBoundingBox";
import getFullTourRoute from "@/camino-trekker/utils/getFullTourRoute";

interface Props {
  type: "tour" | "stop";
  initialMapStyle: string;
  showMapStyleControl?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  initialMapStyle: "light",
  showMapStyleControl: true,
});

/**
 * COMPUTED
 */
const store = useTrekkerStore();
const canCreateMap = computed(
  () => store.tour && store.tour.stops && store.tour.start_location
);
const mapStyleChoices = ["dark", "satellite", "streets", "light"].sort();
const mapStyle = ref(props.initialMapStyle);

interface MapStop {
  index: number;
  number: number;
  title: string;
  href: string;
  startPoint: LngLat;
  stopPoint: LngLat;
  route: LngLat[];
  isActive: boolean;
  color: string;
}

const mapStops = computed((): MapStop[] => {
  const tour = store.tour;
  if (!tour) return [];
  if (!tour.stops) return [];

  return tour.stops.map((stop, index) => ({
    index,
    number: index + 1,
    title: stop.stop_content.title?.[store.locale] ?? `Stop ${index}`,
    href: `/tours/${store.tourId}/stops/${index}`,
    startPoint: getStopPointAtIndex(tour, index - 1),
    stopPoint: getStopPointAtIndex(tour, index),
    route: getStopRouteAtIndex(tour, index),
    isActive: index === store.stopIndex,
    color: getStopColor(index),
  }));
});

const fullTourRoute = computed((): LngLat[] => getFullTourRoute(store.tour));

// BOUNDS
const bounds = computed((): BoundingBox => {
  if (props.type === "tour") {
    return getBoundingBox(fullTourRoute.value);
  }

  // get a bounding box for the current stop
  const stop = mapStops.value[store.stopIndex];
  return getBoundingBox([stop.startPoint, ...stop.route, stop.stopPoint]);
});

// CENTER
const center = computed((): LngLat => getCenterOfBoundingBox(bounds.value));

/**
 * METHODS
 */

function setMapStyle(updatedStyle: string) {
  mapStyle.value = updatedStyle;
}

function getStopColor(index) {
  if (index > store.stopIndex) return "#333";
  if (index === store.stopIndex) return "#0A84FF";
  return "#999";
}
</script>
<style scoped>
.tour-map {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.button-bar {
  display: flex;
  justify-content: flex-end;
}

.button-bar__button {
  border: 0;
  outline: 0;
  border-radius: 0;
  padding: 0.5rem 1rem;
  font-weight: normal;
  font-size: 0.8rem;
  color: var(--gray-dark);
  letter-spacing: 0.02rem;
}

.button-bar__button:hover {
  outline: 0;
}

.button-bar__button:hover {
  background: none;
  color: var(--black);
}

.button-bar__button--is-active {
  color: var(--black);
}

.map-popup__link-container {
  text-align: right;
  margin-top: 0.5rem;
}

.map-popup__link {
  display: inline-flex;
  border: none;
  color: var(--black);
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  align-items: center;
  border-radius: 0.25rem;
  text-transform: uppercase;
  line-height: 1;
}

.map-popup__link:hover {
  background: var(--black);
  color: var(--white);
}

.map-popup__link .material-icons {
  font-size: 1.25rem;
}

.map-popup__stop-number {
  display: inline-flex;
  border: 2px solid var(--black);
  color: var(--black);
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
}

.map-popup__stop-number-container {
  text-align: left;
}

.tour-map--dark .button-bar__button {
  color: var(--gray-dark);
}

.tour-map--dark .button-bar__button--is-active {
  color: var(--gray-light);
}

.map-sheet__map-container {
  border-radius: 0.5rem;
  border: 1px solid var(--gray-light);
}

.tour-map__marker--is-active {
  z-index: 10;
}
</style>
