<template>
  <span>
    <i v-if="tour.walking == 1" class="fas fa-walking"></i>
    <i v-if="tour.biking == 1" class="fas fa-biking"></i>
    <i v-if="tour.driving == 1" class="fas fa-car"></i>
  </span>
</template>

<script>
export default {
  props: ["tour"],
};
</script>
