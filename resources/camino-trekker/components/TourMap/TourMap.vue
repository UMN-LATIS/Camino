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
          'button-bar__button--is-active': styleChoice === mapStyleRef,
        }"
        @click="setMapStyle(styleChoice)"
      >
        {{ capitalize(styleChoice) }}
      </Button>
    </div>
    <Map
      v-if="centerRef"
      class="map-sheet__map-container"
      :center="centerRef"
      :zoom="zoomRef"
      :bounds="boundsRef"
      :mapStyle="mapStyleRef"
      :accessToken="accessToken"
    >
      <MapPolyline
        v-for="(route, i) in allStopRoutesRef"
        :id="`route-${i}`"
        :key="i"
        :positions="route"
        :color="getStopColor(i)"
      />
      <MapMarker
        v-for="(stopPoint, i) in allStopPointsRef"
        :key="i"
        :lng="stopPoint?.lng ?? tour.start_location?.lng"
        :lat="stopPoint?.lat ?? tour.start_location?.lat"
        :color="getStopColor(i)"
      >
        <MapPopup>
          <p class="map-popup__stop-number-container">
            <span class="map-popup__stop-number">
              {{ allStopLabelsRef[i].number }}
            </span>
          </p>
          <h2 class="map-popup__stop-title">
            {{ allStopLabelsRef[i].title }}
          </h2>
          <p class="map-popup__link-container">
            <router-link :to="allStopLabelsRef[i].href" class="map-popup__link">
              <span class="material-icons">arrow_forward</span>
              <span class="sr-only">Go to Stop</span>
            </router-link>
          </p>
        </MapPopup>
      </MapMarker>
    </Map>
  </div>
</template>
<script setup>
import { ref, computed, watch, toRefs } from "vue";
import { string, oneOf, bool, number } from "vue-types";
import Map from "../Map/Map.vue";
import MapPolyline from "../MapPolyline/MapPolyline.vue";
import MapMarker from "../MapMarker/MapMarker.vue";
import MapPopup from "../MapPopup/MapPopup.vue";
import Button from "../Button/Button.vue";
import capitalize from "../../utils/capitalize";
import getFullTourRoute from "../../utils/getFullTourRoute";
import getAllStopPoints from "../../utils/getAllStopPoints";
import getBoundingBox from "../../utils/getBoundingBox";
import getPointsForStop from "./getPointsForStop";
import getCenterOfBoundingBox from "./getCenterOfBoundingBox";
import getAllRoutes from "../../utils/getAllRoutes";
import { useTour, useLocale, useMapBoxAccessToken } from "../../common/hooks";

const props = defineProps({
  type: oneOf(["tour", "stop"]),
  stopIndex: number().isRequired,
  initialMapStyle: string().def("light"),
  showMapStyleControl: bool().def(true),
});

function createAllStopLabels({ tour, locale }) {
  return tour.stops.map((stop, index) => ({
    title: stop.stop_content.title[locale],
    href: `/tours/${stop.tour_id}/stops/${index}`,
    number: index + 1,
  }));
}

function getStopColor(index) {
  if (index < stopIndex.value) return "#7EEAFC";
  if (index === stopIndex.value) return "#0A84FF";
  return "#999";
}

function setMapStyle(updatedStyle) {
  mapStyleRef.value = updatedStyle;
}

const { tour } = useTour();
const { stopIndex } = toRefs(props);
const { locale } = useLocale();
const { accessToken } = useMapBoxAccessToken();
const boundsRef = ref(null);
const centerRef = ref(null);
const zoomRef = ref(10);
const mapStyleChoices = ["dark", "satellite", "streets", "light"].sort();
const mapStyleRef = ref(props.initialMapStyle);
const fullTourRouteRef = computed(() =>
  getFullTourRoute(tour.value).filter(Boolean)
);
const allStopRoutesRef = computed(() => getAllRoutes(tour.value));
const allStopPointsRef = computed(() => getAllStopPoints(tour.value));
const startPointRef = computed(() => tour.value.start_location);
const allStopLabelsRef = computed(() =>
  createAllStopLabels({
    tour: tour.value,
    locale: locale.value,
  })
);

if (props.type === "tour") {
  boundsRef.value = getBoundingBox(fullTourRouteRef.value);
  centerRef.value = startPointRef.value;
}
if (props.type === "stop") {
  const stopPoints = getPointsForStop(
    stopIndex.value,
    allStopPointsRef.value,
    allStopRoutesRef.value
  );
  boundsRef.value = getBoundingBox(stopPoints.filter(Boolean));
  centerRef.value = getCenterOfBoundingBox(boundsRef.value);
  zoomRef.value = 16;
}

// update bounds when stop changes
// if stop map
watch(stopIndex, () => {
  if (props.type !== "stop") return;

  const stopPoints = getPointsForStop(
    stopIndex.value,
    allStopPointsRef.value,
    allStopRoutesRef.value
  );
  boundsRef.value = getBoundingBox(stopPoints);
  centerRef.value = getCenterOfBoundingBox(boundsRef.value);
});
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
