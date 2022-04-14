<template>
  <div class="form-group row my-2">
    <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
    <div class="col-sm-6">
      <div v-if="modelValue.lat || modelValue.lng">
        <b>Latitude:</b> {{ modelValue.lat }}, <b>Longitude:</b>
        {{ modelValue.lng }}
      </div>
      <LocationSelector
        :basemap="basemap"
        :location="modelValue"
        @update:location="(payload) => $emit('update:modelValue', payload)"
      ></LocationSelector>
    </div>
  </div>
</template>

<script setup>
import LocationSelector from "./LocationSelector.vue";

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  basemap: {
    type: Object,
    default: null,
  },
});

defineEmits(["update:modelValue"]);
</script>
