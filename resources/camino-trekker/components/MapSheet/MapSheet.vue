<template>
  <Sheet class="map-sheet" title="Map" :isOpen="isOpen" @close="$emit('close')">
    <TourMap
      :initialMapStyle="MapboxMapStyle.streets"
      type="tour"
      :stopIndex="store.stopIndex"
    />
  </Sheet>
</template>
<script setup lang="ts">
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import Sheet from "../Sheet/Sheet.vue";
import TourMap from "../TourMap/TourMap.vue";
import { MapboxMapStyle } from "@/types";

interface Props {
  isOpen?: boolean;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
});

const store = useTrekkerStore();

defineEmits(["close"]);
</script>

<style>
.map-sheet .sheet__header {
  border-bottom: 0;
  margin-bottom: 0;
}
</style>
