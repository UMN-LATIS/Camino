<template>
  <Sheet class="map-sheet" title="Map" :isOpen="isOpen" @close="$emit('close')">
    <TourMap initialMapStyle="streets" type="tour" :stopIndex="stopIndex" />
  </Sheet>
</template>
<script setup>
import { useStopIndex } from "../../common/hooks";
import Sheet from "../Sheet/Sheet.vue";
import TourMap from "../TourMap/TourMap.vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);

const { stopIndex } = useStopIndex();
</script>

<style>
.map-sheet .sheet__header {
  border-bottom: 0;
  margin-bottom: 0;
}
</style>
