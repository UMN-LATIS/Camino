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

    <!-- 
      NOTE: the :key on the map is set so that the map
      rerenders when the stopindex changes. without it
      only some subcomponents might rerender and multiple
      stops might look active
    -->
    <MapboxGlMap
      v-if="canCreateMap"
      :key="trekkerStore.stopIndex"
      class="map-sheet__map-container"
      :center="center"
      :zoom="type === 'tour' ? 16 : 10"
      :bounds="bounds"
      :mapStyle="mapStyle"
      :accessToken="config.mapBox.accessToken"
    >
      <!-- 
        The Map is built up in layers so that the
        active stuff appears on top:
        1. Inactive stop routes
        2. All stop markers except the current
           stop and the previous stop
        3. Active stop route
        4. previous stop marker
        5. current stop marker
      -->

      <!-- all stop routes -->
      <TourMapRoute
        v-for="stop in mapStops"
        :key="stop.id"
        :mapStop="stop"
        variant="gradient-inactive"
      />

      <!-- all markers except current and previous -->
      <TourMapStop
        v-for="stop in allButCurrentAndPrevStops"
        :key="`marker-${stop.id}`"
        :mapStop="stop"
        @click="handleTourMapStopClick(stop)"
      />

      <!-- active stop route -->
      <TourMapRoute
        v-if="currentMapStop"
        :key="currentMapStop.id"
        :mapStop="currentMapStop"
        variant="gradient-active"
      />

      <!-- 
        mark the tour start location 
        if there's no preceeding point,
        then making this the it
      -->
      <TourMapStarMarker
        v-if="startLocation"
        :lng="startLocation.lng"
        :lat="startLocation.lat"
        :color="trekkerStore.stopIndex === 0 ? 'orange' : 'default'"
      />

      <!-- preceeding point -->
      <TourMapStop
        v-if="preceedingMapStop"
        :key="`marker-${preceedingMapStop.id}`"
        :mapStop="preceedingMapStop"
        @click="handleTourMapStopClick(preceedingMapStop)"
      />

      <!-- current stop -->
      <TourMapStop
        v-if="currentMapStop"
        :key="`marker-${currentMapStop.id}`"
        :mapStop="currentMapStop"
        @click="handleTourMapStopClick(currentMapStop)"
      />
    </MapboxGlMap>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import MapboxGlMap from "../Map/Map.vue";
import TourMapRoute from "./TourMapRoute.vue";
import Button from "../Button/Button.vue";
import capitalize from "../../utils/capitalize";
import getBoundingBox from "../../utils/getBoundingBox";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import config from "@trekker/config";
import {
  BoundingBox,
  LngLat,
  MapboxMapStyle,
  Maybe,
  type TourMapStop as TourMapStopType,
} from "@/types";
import { getStopRouteByIndex } from "@/camino-trekker/utils/getStopRouteByIndex";
import TourMapStop from "./TourMapStop.vue";
import { getCenterOfBoundingBox } from "@trekker/utils/getCenterOfBoundingBox";
import getFullTourRoute from "@/camino-trekker/utils/getFullTourRoute";
import { useRouter } from "vue-router";
import { findLastTargetPointByIndex } from "@/camino-trekker/utils/findLastTargetPointByIndex";
import TourMapStarMarker from "./TourMapStarMarker.vue";

interface Props {
  type: "tour" | "stop";
  initialMapStyle?: MapboxMapStyle;
  showMapStyleControl?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialMapStyle: MapboxMapStyle.light,
  showMapStyleControl: true,
});

/**
 * COMPUTED
 */
const trekkerStore = useTrekkerStore();
const router = useRouter();
const canCreateMap = computed(
  () =>
    trekkerStore.tour &&
    trekkerStore.tour.stops &&
    trekkerStore.tour.start_location
);
const mapStyleChoices = [
  MapboxMapStyle.dark,
  MapboxMapStyle.satellite,
  MapboxMapStyle.streets,
  MapboxMapStyle.light,
].sort();

const mapStyle = ref(props.initialMapStyle);

const mapStops = computed((): TourMapStopType[] => {
  const tour = trekkerStore.tour;
  if (!tour) return [];
  if (!tour.stops) return [];

  return tour.stops.map((stop, index) => ({
    id: stop.id,
    index,
    number: index + 1,
    title: stop.stop_content.title?.[trekkerStore.locale] ?? `Stop ${index}`,
    href: `/tours/${trekkerStore.tourId}/stops/${index}`,
    startPoint: findLastTargetPointByIndex(tour, index - 1),
    stopPoint: findLastTargetPointByIndex(tour, index),
    route: getStopRouteByIndex(tour, index),
    isActive: index === trekkerStore.stopIndex,
    preceedsActive: index === trekkerStore.stopIndex - 1,
    color: getStopColor(index),
  }));
});

const allButCurrentAndPrevStops = computed((): TourMapStopType[] =>
  mapStops.value.filter((s) => !s.isActive && !s.preceedsActive)
);

const currentMapStop = computed(
  (): Maybe<TourMapStopType> => mapStops.value.find((s) => s.isActive) ?? null
);
const preceedingMapStop = computed(
  (): Maybe<TourMapStopType> =>
    mapStops.value.find((s) => s.preceedsActive) ?? null
);

const startLocation = computed(
  (): Maybe<LngLat> => trekkerStore.tour?.start_location ?? null
);

const fullTourRoute = computed((): LngLat[] =>
  getFullTourRoute(trekkerStore.tour)
);

// BOUNDS
const bounds = computed((): BoundingBox => {
  if (props.type === "tour") {
    return getBoundingBox(fullTourRoute.value);
  }

  // get a bounding box for the current stop
  const stop = mapStops.value[trekkerStore.stopIndex];
  return getBoundingBox([stop.startPoint, ...stop.route, stop.stopPoint]);
});

// CENTER
const center = computed((): LngLat => getCenterOfBoundingBox(bounds.value));

/**
 * METHODS
 */

function setMapStyle(updatedStyle: MapboxMapStyle) {
  mapStyle.value = updatedStyle;
}

function getStopColor(index) {
  if (index > trekkerStore.stopIndex) return "#333";
  if (index === trekkerStore.stopIndex) return "#0A84FF";
  return "#999";
}

function handleTourMapStopClick(stop: Maybe<TourMapStopType>) {
  if (!stop) {
    throw new Error("handleStopError: no stop");
  }

  // close map sheet and then go to the stop
  trekkerStore.closeActiveSheet();
  router.push(stop.href);
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
</style>
