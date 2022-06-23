<template>
  <div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { watch, inject } from "vue";
import { toGeoJsonLineString } from "./toGeoJson";
import type { LngLat } from "@/types";
import { MapInjectionKey } from "@/shared/constants";

interface Props {
  positions: LngLat[];
  // unique ID for this data source
  id: string;
  color: string;
}

const props = defineProps<Props>();
const map = inject(MapInjectionKey, null);

function addDataLayer({ id, positions, color }) {
  if (!map) return;

  if (!id) {
    throw Error(`addDataLayer is missing id '${id}'`);
  }

  if (!Array.isArray(positions)) {
    throw Error(`addDataLayer is missing positions '${positions}'`);
  }

  // remove existing data layer and source if it exists
  if (map.value.getLayer(id)) {
    map.value.removeLayer(id);
  }

  if (map.value.getSource(id)) {
    map.value.removeSource(id);
  }

  map.value
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

watch(
  () => props.positions,
  () => addDataLayer(props)
);

watch([map], () => {
  if (!map) return;

  // wait for map to load before adding data
  map.value.on("load", () => addDataLayer(props));
  // redraw if map style changes
  map.value.on("style.load", () => addDataLayer(props));
});

// update line color if props change
watch(
  () => props.color,
  () => {
    if (!map) return;
    const updateLineColor = () =>
      map.value.setPaintProperty(props.id, "line-color", props.color);

    if (map.value.isStyleLoaded()) {
      return updateLineColor();
    }
    map.value.on("style.load", updateLineColor);
  }
);
</script>
