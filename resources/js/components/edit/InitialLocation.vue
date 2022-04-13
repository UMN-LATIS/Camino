<template>
  <div>
    <p>General location for tour: {{ location }}</p>
    <!-- FIXME: This mutates the location prop! -->
    <!-- eslint-disable vue/no-mutating-props -->
    <LocationSelector
      :basemap="basemap"
      :location="location"
      @update:location="(payload) => $emit('update:location', payload)"
    ></LocationSelector>
    <!-- eslint-enable -->
  </div>
</template>

<script>
import LocationSelector from "./LocationSelector.vue";
export default {
  components: {
    LocationSelector,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["location", "basemap"],
  emits: ["update:location"],
};
</script>
