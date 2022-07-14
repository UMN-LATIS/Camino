<template>
  <div
    class="tuck-on-scroll"
    :class="{
      'tuck-on-scroll--is-tucked': isTucked,
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useScroll } from "@vueuse/core";
const { directions, arrivedState } = useScroll(window, {
  onScroll: handleScroll,
  throttle: 300,
});

const isTucked = ref(false);

function handleScroll() {
  if (directions.bottom) {
    isTucked.value = true;
  }
  if (directions.top || arrivedState.top) {
    isTucked.value = false;
  }
}
</script>
<style scoped>
.tuck-on-scroll {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  transition: transform 0.3s ease-in-out;
}
.tuck-on-scroll--is-tucked {
  transform: translateY(-100%);
}
</style>
