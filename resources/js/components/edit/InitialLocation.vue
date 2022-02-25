<template>
  <div>
    <p>General location for tour: {{ location }}</p>
    <!-- FIXME: This mutates the location prop! -->
    <!-- eslint-disable -->
    <location-selector
      :location.sync="location"
      :basemap="basemap"
    ></location-selector>
    <!-- eslint-enable -->
  </div>
</template>

<script>
export default {
  props: ["location", "basemap"],
};
</script>
