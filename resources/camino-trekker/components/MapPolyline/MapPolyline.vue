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
import { type LineLayer } from "mapbox-gl";

interface Props {
  positions: LngLat[];
  // unique ID for this data source
  id: string;
  color?: string;
  variant?: "solid" | "dashed" | "gradient-active" | "gradient-inactive";
}

const props = withDefaults(defineProps<Props>(), {
  color: "#0472f8",
  variant: "solid",
});
const map = inject(MapInjectionKey, null);

function addDataLayer({ id, positions, color = props.color }) {
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

  const layerVariants: Record<string, Partial<LineLayer>> = {
    solid: {
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 6,
      },
    },
    dashed: {
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-dasharray": [0, 2],
        "line-width": 3,
      },
    },
    "gradient-active": {
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 6,
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "#FF9D25",
          1,
          "#FF295D",
        ],
      },
    },
    "gradient-inactive": {
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 6,
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "#ccc",
          1,
          "#999",
        ],
      },
    },
  };

  map.value
    .addSource(id, {
      type: "geojson",
      data: toGeoJsonLineString(positions.filter(Boolean)),
      lineMetrics: true,
    })
    .addLayer({
      id,
      source: id,
      type: "line",
      ...layerVariants[props.variant],
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
