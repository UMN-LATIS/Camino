<template>
  <div class="form-group row my-4 initial-location">
    <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
    <div class="col-sm-6 bg-white p-0 rounded-3 border overflow-hidden">
      <MapboxLocationSelector
        :location="modelValue"
        :tourId="tourId"
        @update:location="(location: LngLat) => $emit('update:modelValue', location)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomBaseMap, LngLat, Maybe } from "@/types";
import MapboxLocationSelector from "../../components/MapboxLocationSelector.vue";

interface Props {
  tourId: number;
  modelValue: Maybe<LngLat>;
  basemap?: Maybe<CustomBaseMap>;
}
withDefaults(defineProps<Props>(), {
  basemap: null,
});

interface Emits {
  (eventName: "update:modelValue", location: LngLat);
}

defineEmits<Emits>();
</script>
