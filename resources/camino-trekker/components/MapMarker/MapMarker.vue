<template>
  <div class="map-marker">
    <div
      ref="mapContents"
      class="map-marker__contents"
      :class="{
        'map-marker__contents--is-active': active,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, unref, useSlots } from "vue";
import { Marker } from "mapbox-gl";
import { inject, provide } from "vue";
import { MapInjectionKey, MarkerInjectionKey } from "@/shared/constants";
import { LngLat } from "@/types";

interface Props {
  lng: number;
  lat: number;
  color?: string;
  draggable?: boolean;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#111",
  draggable: false,
});

interface Emits {
  (eventName: "drag", coords: LngLat);
}
const emit = defineEmits<Emits>();

const mapRef = inject(MapInjectionKey);
const marker = ref<Marker | null>(null);
const mapContents = ref<HTMLDivElement | undefined>();
const slots = useSlots();
console.log({ slots });

watch([mapRef, props], () => {
  const map = unref(mapRef);

  // if no map yet, nothing to do
  if (!map) return;

  // remove old marker if it exists
  const oldMarker = unref(marker);
  if (oldMarker) oldMarker.remove();

  marker.value = new Marker({
    color: props.color,
    draggable: props.draggable,
    element: mapContents.value,
  })
    .setLngLat([props.lng, props.lat])
    .addTo(map)
    .on("dragend", () => {
      const lngLat = marker.value?.getLngLat();
      if (!lngLat) return;
      emit("drag", {
        lng: lngLat.lng,
        lat: lngLat.lat,
      });
    });
});

provide(MarkerInjectionKey, marker);
</script>
<style scoped>
.map-marker__contents--is-active {
  z-index: 1;
}
</style>
