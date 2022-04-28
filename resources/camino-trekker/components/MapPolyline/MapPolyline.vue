<template><slot></slot></template>
<script setup>
import { arrayOf, number, shape, string } from "vue-types";
import { watch, inject, toRefs } from "vue";
import { toGeoJsonLineString } from "./toGeoJson";

const props = defineProps({
  positions: arrayOf(
    shape({
      lng: number().isRequired,
      lat: number().isRequired,
    })
  ),
  // unique ID for this data source
  id: string().isRequired,
  color: string(),
});

const mapRef = inject("map", null);
const { color: colorRef } = toRefs(props);

function addDataLayer({ id, positions, color }) {
  const map = mapRef.value;

  if (!map) return;
  if (!id) {
    throw Error(`addDataLayer is missing id '${id}'`);
  }
  if (!Array.isArray(positions)) {
    throw Error(`addDataLayer is missing positions '${positions}'`);
  }

  // remove existing data layer and source if it exists
  if (map.getLayer(id)) map.removeLayer(id);
  if (map.getSource(id)) map.removeSource(id);

  mapRef.value
    .addSource(id, {
      type: "geojson",
      data: toGeoJsonLineString(positions.filter(Boolean)),
    })
    .addLayer({
      id,
      source: id,
      type: "line",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color || "#0472f8",
        "line-width": 6,
      },
    });
}

watch(mapRef, () => {
  if (!mapRef.value) return;
  // wait for map to load before adding data
  mapRef.value.on("load", () => addDataLayer(props));
  // redraw if map style changes
  mapRef.value.on("style.load", () => addDataLayer(props));
});

// update line color if props change
watch(colorRef, () => {
  const updateLineColor = () =>
    mapRef.value.setPaintProperty(props.id, "line-color", colorRef.value);
  if (mapRef.value.isStyleLoaded()) {
    return updateLineColor();
  }
  mapRef.value.on("style.load", updateLineColor);
});
</script>
