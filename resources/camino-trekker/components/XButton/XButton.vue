<template>
  <button class="x-button" @click="$emit('click')">
    <span class="material-icons">close</span>
    <span class="sr-only">Close</span>
  </button>
</template>
<script setup lang="ts">
defineEmits<{
  (eventName: "click");
}>();
</script>
<style scoped>
.x-button {
  display: inline-flex;
  background: transparent;
  color: var(--black);
  border: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  line-height: 1;
  align-items: center;
  justify-content: center;
  transition: all ease 0.2s;
}

.x-button:hover {
  background: var(--white);
  color: var(--system-red);
}
</style>
