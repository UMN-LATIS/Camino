<template>
  <div class="map-marker">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, unref } from "vue";
import { Marker } from "mapbox-gl";
import { inject, provide } from "vue";
import { MapInjectionKey, MarkerInjectionKey } from "@/shared/constants";

interface Props {
  lng: number;
  lat: number;
  color: string;
}

const props = defineProps<Props>();
const mapRef = inject(MapInjectionKey);
const marker = ref<Marker | null>(null);

watch([mapRef, props], () => {
  const map = unref(mapRef);

  // if no map yet, nothing to do
  if (!map) return;

  // remove old marker if it exists
  const oldMarker = unref(marker);
  if (oldMarker) oldMarker.remove();

  marker.value = new Marker({ color: props.color })
    .setLngLat([props.lng, props.lat])
    .addTo(map);
});

provide(MarkerInjectionKey, marker);
</script>
