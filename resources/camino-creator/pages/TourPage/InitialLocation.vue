<template>
  <div class="form-group row my-4">
    <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
    <div class="col-sm-6">
      <div v-if="modelValue">
        <b>Latitude:</b>
        <span data-cy="tour-location-lat"> {{ modelValue.lat }} </span>,
        <b>Longitude:</b>
        <span data-cy="tour-location-lng">
          {{ modelValue.lng }}
        </span>
      </div>
      <LocationSelector
        :basemap="basemap"
        :location="modelValue"
        @update:location="(location: LngLat) => $emit('update:modelValue', location)"
      ></LocationSelector>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomBaseMap, LngLat, Maybe } from "@/types";
import LocationSelector from "../../components/MapboxLocationSelector.vue";

interface Props {
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
