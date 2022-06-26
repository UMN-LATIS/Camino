<template>
  <div
    class="map-marker-label"
    :class="{
      'map-marker-label--is-active': active,
    }"
  >
    <div class="map-marker-label__content">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: false,
  }
);
</script>
<style scoped>
.map-marker-label {
  position: relative;
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Map Dot */
.map-marker-label:before {
  display: block;
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #bbb;
}

.map-marker-label__content {
  position: absolute;
  left: -0.33rem;
  top: -1.5rem;
  border: 0.125rem solid #999;
  color: #999;
  background: #fff;
  display: flex;
  font-size: 0.75rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
}
.map-marker-label--is-active {
  background: blue;
}
</style>
