<template>
  <div
    class="card stop-route-card"
    data-cy="stop-route-card"
    :data-cy-stop-id="stop.id"
  >
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <span class="badge bg-secondary me-2">#{{ index + 1 }}</span>
        <strong>{{ stopTitle }}</strong>
        <small class="text-muted ms-2">stop {{ stop.id }}</small>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="row g-0">
        <div class="col-md-7 stop-route-card__map-col">
          <Map
            class="stop-route-card__map"
            :center="mapCenter"
            :zoom="16"
            mapStyle="streets"
            :accessToken="mapBoxToken"
          >
            <MapMarker
              v-if="startPoint"
              :lng="startPoint.lng"
              :lat="startPoint.lat"
            >
              <MapMarkerLabel color="orange">
                {{ index === 0 ? "★" : index }}
              </MapMarkerLabel>
            </MapMarker>

            <MapMarker
              :lng="effectiveTargetPoint.lng"
              :lat="effectiveTargetPoint.lat"
              :draggable="true"
              @drag="(pt) => $emit('update:targetPoint', pt)"
            >
              <MapMarkerLabel color="pink" :pulse="true">
                {{ index + 1 }}
              </MapMarkerLabel>
            </MapMarker>

            <MapPolylineEditable
              v-if="startPoint"
              :id="`stop-${stop.id}-route`"
              :startPoint="startPoint"
              :route="navStage.route ?? []"
              :endPoint="effectiveTargetPoint"
              @update:route="
                (updatedRoute) => $emit('update:route', updatedRoute)
              "
            />
          </Map>
        </div>
        <div class="col-md-5">
          <div class="stop-route-card__data">
            <dl class="small mb-0">
              <dt>startPoint (route[0])</dt>
              <dd>
                <pre class="mb-2">{{ formatLngLat(startPoint) }}</pre>
              </dd>

              <dt>targetPoint</dt>
              <dd>
                <pre class="mb-2">{{ formatLngLat(navStage.targetPoint) }}</pre>
              </dd>

              <dt>
                route ({{ navStage.route?.length ?? 0 }}
                {{ (navStage.route?.length ?? 0) === 1 ? "point" : "points" }})
              </dt>
              <dd>
                <pre class="route-pre mb-0">{{
                  formatRoute(navStage.route)
                }}</pre>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useConfig from "@/shared/useConfig";
import getOffsetPointFrom from "@/shared/getOffsetPointFrom";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Map from "@trekker/components/Map/Map.vue";
import MapMarker from "@trekker/components/MapMarker/MapMarker.vue";
import MapMarkerLabel from "@trekker/components/MapMarkerLabel/MapMarkerLabel.vue";
import MapPolylineEditable from "@trekker/components/MapPolylineEditable/MapPolylineEditable.vue";
import {
  type TourStop,
  type NavigationStage,
  type LngLat,
  type Maybe,
  type TourStopRoute,
  Locale,
} from "@/types";

interface Props {
  tourId: number;
  stop: TourStop;
  navStage: NavigationStage;
  index: number;
}
const props = defineProps<Props>();

defineEmits<{
  (eventName: "update:route", route: LngLat[]);
  (eventName: "update:targetPoint", point: LngLat);
}>();

const config = useConfig();
const mapBoxToken = config.mapBox.accessToken;
const creatorStore = useCreatorStore();

const stopTitle = computed((): string => {
  const title = props.stop.stop_content.title;
  return title[Locale.en] ?? Object.values(title)[0] ?? "(untitled)";
});

const startPoint = computed<Maybe<LngLat>>(
  () => creatorStore.getTourStopStartPoint(props.tourId, props.stop.id).value,
);

const effectiveTargetPoint = computed((): LngLat => {
  if (props.navStage.targetPoint) return props.navStage.targetPoint;
  if (startPoint.value) {
    return getOffsetPointFrom(startPoint.value);
  }
  return { lng: 0, lat: 0 };
});

const mapCenter = computed((): LngLat => {
  return (
    props.navStage.targetPoint ?? startPoint.value ?? effectiveTargetPoint.value
  );
});

function formatLngLat(point: Maybe<LngLat>): string {
  if (!point) return "null";
  return `{ lng: ${point.lng.toFixed(6)}, lat: ${point.lat.toFixed(6)} }`;
}

function formatRoute(route: Maybe<TourStopRoute>): string {
  if (!route?.length) return "[]";
  return route
    .map(
      (point, i) =>
        `[${i}] { lng: ${point.lng.toFixed(6)}, lat: ${point.lat.toFixed(6)} }`,
    )
    .join("\n");
}
</script>

<style scoped>
.stop-route-card__map {
  height: 320px;
}
.stop-route-card__data {
  padding: 0.75rem 1rem;
  background: #fafafa;
  height: 100%;
  overflow-y: auto;
  max-height: 320px;
}
.stop-route-card__data dt {
  font-weight: 600;
  margin-top: 0.5rem;
  color: #555;
}
.stop-route-card__data dt:first-child {
  margin-top: 0;
}
.stop-route-card__data pre {
  font-size: 0.75rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  white-space: pre-wrap;
}
.route-pre {
  max-height: 8rem;
  overflow-y: auto;
}
</style>
