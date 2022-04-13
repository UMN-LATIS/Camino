<template>
  <div>
    <p>General location for tour: {{ location }}</p>
    <!-- FIXME: This mutates the location prop! -->
    <!-- eslint-disable vue/no-mutating-props -->
    <LocationSelector
      v-model:location="location"
      :basemap="basemap"
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
};
</script>
