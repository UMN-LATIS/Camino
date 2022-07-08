<template>
  <div
    class="map-marker-label"
    :class="{
      'map-marker-label--pink': color === 'pink',
      'map-marker-label--orange': color === 'orange',
      'map-marker-label--bg-pulse': pulse,
    }"
  >
    <div class="map-marker-label__content">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
export type MapMarkerLabelColors = "pink" | "orange" | "default";

withDefaults(
  defineProps<{
    color?: MapMarkerLabelColors;
    pulse?: boolean;
  }>(),
  {
    color: "default",
    pulse: false,
  }
);
</script>
<style scoped>
.map-marker-label {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  --pink: #ff295d;
  --pink-light: rgba(255, 190, 206, 0.75);
  --orange: #ff9d25;
  --orange-light: rgba(255, 229, 0, 0.5);
  --gray: #999;
  --gray-light: #bbb;

  --color: var(--gray);
  --color-light: var(--gray-light);
}

/* Map Dot */
.map-marker-label:before {
  display: block;
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color);
}

.map-marker-label__content {
  position: absolute;
  left: 50%;
  top: -1rem;
  transform: translate(-50%, 0);
  border: 0.125rem solid var(--color);
  color: var(--color);
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
.map-marker-label--pink {
  --color: var(--pink);
  --color-light: var(--pink-light);
}

.map-marker-label--orange {
  --color: var(--orange);
  --color-light: var(--orange-light);
}
.map-marker-label--pink,
.map-marker-label--orange {
  z-index: 10; /* special variants should appear above defaults */
}

.map-marker-label--bg-pulse {
  background: var(--color-light);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    /* box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2); */
    box-shadow: 0 0 0 0px var(--color-light);
  }
  100% {
    box-shadow: 0 0 0 1.5rem rgba(0, 0, 0, 0);
  }
}
</style>
