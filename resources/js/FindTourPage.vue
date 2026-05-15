<template>
  <div class="find-tour-page">
    <Map
      v-if="tourBounds"
      class="find-tour-map"
      :center="null"
      :zoom="10"
      :bounds="tourBounds"
      mapStyle="streets"
      :accessToken="config.mapBox.accessToken"
      @load="handleMapLoad"
    />
    <div v-else class="find-tour-map find-tour-map--loading" />

    <div class="row mt-2">
      <div class="col d-flex justify-content-center" style="font-size: 1.4em">
        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="walk" type="checkbox" class="form-check-input" />
            <i class="fas fa-walking me-2"></i>Walk
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="bike" type="checkbox" class="form-check-input" />
            <i class="fas fa-biking me-2"></i>Bike
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="drive" type="checkbox" class="form-check-input" />
            <i class="fas fa-car me-2"></i>Drive
          </label>
        </div>
      </div>
    </div>

    <section class="container my-4">
      <h2 class="tourlist__heading">Public Tours</h2>
      <ul class="tourlist">
        <a
          v-for="tour in tours"
          :key="tour.id"
          :href="`/trekker/tours/${tour.id}`"
        >
          <li class="tour-item">
            <div class="tour-item__image">
              <img
                v-if="getTourImage(tour)"
                :src="getTourImage(tour)?.src"
                :alt="getTourImage(tour)?.alt"
              />
              <div v-else class="tour-item__image-fallback">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>
            <div class="tour-item__body">
              <h3 class="tour-item__title">{{ tour.title }}</h3>
              <p v-if="getTourSubtitle(tour)" class="tour-item__subtitle">
                {{ getTourSubtitle(tour) }}
              </p>
            </div>
            <i class="fas fa-chevron-right tour-item__chevron"></i>
          </li>
        </a>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, watch } from "vue";
import { Map as MapboxMap, Marker, Popup, GeoJSONSource } from "mapbox-gl";
import useConfig from "@/shared/useConfig";
import Map from "@trekker/components/Map/Map.vue";
import { BoundingBox } from "@/types";

interface Tour {
  id: number;
  title: string;
  walking: boolean;
  biking: boolean;
  driving: boolean;
  transport_type: 0 | 1 | 2;
  start_location: { lat: number; lng: number };
  stops: Array<{
    stop_content?: { header_image?: { src: string; alt: string } };
  }>;
  geocoded?: { city?: string; state?: string };
}

const TOURS_SOURCE = "tours-source";
const CLUSTER_LAYER = "tour-clusters";
const CLUSTER_COUNT_LAYER = "tour-cluster-count";
const UNCLUSTERED_LAYER = "tour-unclustered";

const config = useConfig();
const mapRef = shallowRef<MapboxMap | null>(null);
const tours = ref<Tour[]>([]);
const domMarkers = shallowRef<{ id: number; marker: Marker }[]>([]);
const walk = ref(true);
const bike = ref(true);
const drive = ref(true);

const filteredTours = computed(() =>
  tours.value.filter(
    (tour) =>
      (walk.value && tour.walking) ||
      (bike.value && tour.biking) ||
      (drive.value && tour.driving),
  ),
);

const tourBounds = computed((): BoundingBox | null => {
  const locations = tours.value.map((t) => t.start_location).filter(Boolean);

  if (locations.length === 0) return null;

  const lngs = locations.map((l) => l.lng);
  const lats = locations.map((l) => l.lat);

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
});

const toursGeoJson = computed(() => ({
  type: "FeatureCollection" as const,
  features: filteredTours.value
    .filter((t) => t.start_location)
    .map((tour) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [tour.start_location.lng, tour.start_location.lat],
      },
      properties: {
        id: tour.id,
        title: tour.title,
        transport_type: tour.transport_type,
      },
    })),
}));

function getTourImage(tour: Tour) {
  return tour.stops[0]?.stop_content?.header_image ?? null;
}

function getTourSubtitle(tour: Tour) {
  if (tour.geocoded?.city && tour.geocoded?.state) {
    return `${tour.geocoded.city}, ${tour.geocoded.state}`;
  }
  return "";
}

function transportIcon(transportType: number): string {
  if (transportType === 0) return '<i class="fas fa-walking me-2"></i>';
  if (transportType === 1) return '<i class="fas fa-biking me-2"></i>';
  if (transportType === 2) return '<i class="fas fa-car me-2"></i>';
  return "";
}

function setupClusterLayers(map: MapboxMap) {
  map.addSource(TOURS_SOURCE, {
    type: "geojson",
    data: toursGeoJson.value,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // Cluster circles
  map.addLayer({
    id: CLUSTER_LAYER,
    type: "circle",
    source: TOURS_SOURCE,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#1a1a1a",
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 100, 40],
      "circle-stroke-width": 4,
      "circle-stroke-color": "rgba(26, 26, 26, 0.25)",
    },
  });

  // Cluster count labels
  map.addLayer({
    id: CLUSTER_COUNT_LAYER,
    type: "symbol",
    source: TOURS_SOURCE,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-size": 13,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  // Invisible unclustered layer for querying visibility
  map.addLayer({
    id: UNCLUSTERED_LAYER,
    type: "circle",
    source: TOURS_SOURCE,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "transparent",
      "circle-radius": 1,
    },
  });

  // Click cluster → zoom in
  map.on("click", CLUSTER_LAYER, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [CLUSTER_LAYER],
    });
    if (!features.length) return;
    const clusterId = features[0].properties?.cluster_id;
    const source = map.getSource(TOURS_SOURCE);
    if (!source || source.type !== "geojson") return;
    (source as GeoJSONSource).getClusterExpansionZoom(
      clusterId,
      (err: Error | null, zoom: number) => {
        if (err) return;
        map.easeTo({
          center: (features[0].geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ],
          zoom,
        });
      },
    );
  });

  // Cursor on clusters
  map.on("mouseenter", CLUSTER_LAYER, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", CLUSTER_LAYER, () => {
    map.getCanvas().style.cursor = "";
  });

  // Sync DOM marker visibility after each render
  map.on("idle", syncMarkerVisibility);
}

function rebuildDOMMarkers() {
  const map = mapRef.value;
  if (!map) return;

  for (const { marker } of domMarkers.value) {
    marker.remove();
  }
  domMarkers.value = [];

  for (const tour of filteredTours.value) {
    if (!tour.start_location) continue;

    const popup = new Popup({ offset: 25 }).setHTML(
      `<p><strong>${tour.title}</strong></p>` +
        transportIcon(tour.transport_type) +
        `<a href="/trekker/tours/${tour.id}">Start tour</a>`,
    );

    const marker = new Marker({ color: "#1a1a1a" })
      .setLngLat([tour.start_location.lng, tour.start_location.lat])
      .setPopup(popup)
      .addTo(map);

    // Start hidden; syncMarkerVisibility will show unclustered ones
    marker.getElement().style.visibility = "hidden";
    domMarkers.value.push({ id: tour.id, marker });
  }

  syncMarkerVisibility();
}

function syncMarkerVisibility() {
  const map = mapRef.value;
  if (!map || !map.getLayer(UNCLUSTERED_LAYER)) return;

  const unclustered = map.queryRenderedFeatures(undefined, {
    layers: [UNCLUSTERED_LAYER],
  });
  const visibleIds = new Set(unclustered.map((f) => f.properties?.id));

  for (const { id, marker } of domMarkers.value) {
    marker.getElement().style.visibility = visibleIds.has(id)
      ? "visible"
      : "hidden";
  }
}

function updateSourceData() {
  const map = mapRef.value;
  if (!map) return;
  const source = map.getSource(TOURS_SOURCE);
  if (!source || source.type !== "geojson") return;
  (source as GeoJSONSource).setData(toursGeoJson.value);
  rebuildDOMMarkers();
}

function handleMapLoad(map: MapboxMap) {
  mapRef.value = map;
  setupClusterLayers(map);
  rebuildDOMMarkers();
}

watch(filteredTours, updateSourceData);

window.axios.get("/api/tours").then((res) => {
  tours.value = res.data;
});
</script>

<style scoped>
.find-tour-page {
  background: #f3f4f6;
  color: #111827;
}

.find-tour-map {
  height: 60vh;
  width: 100%;
}

.find-tour-map--loading {
  background: #e5e7eb;
}

.tourlist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
}

.tourlist__heading {
  font-size: 1.25rem;
  font-weight: bold;
}

.tourlist > a {
  text-decoration: none;
  color: #111827;
  background: #fff;
  border-radius: 0.25rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: cubic-bezier(0, 0, 0.2, 1) 100ms;
  display: flex;
}

.tour-item {
  width: 100%;
  display: grid;
  grid-template-columns: 8rem 1fr 2rem;
  align-items: center;
  gap: 1rem;
}
.tour-item > a:hover {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.tour-item__image {
  align-self: stretch;
  display: flex;
  background: #e5e7eb;
  align-items: center;
  justify-content: center;
}

.tour-item__image img {
  object-fit: cover;
}

.tour-item__title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}
.tour-item__subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.tour-item__body {
  padding: 1rem 0;
}
.tour-item__chevron {
  color: #d1d5db;
}
.tour-item__image-fallback i {
  font-size: 2rem;
}
</style>
