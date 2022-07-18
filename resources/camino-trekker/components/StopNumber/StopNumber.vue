<template>
  <div class="stop-number">
    <span class="stop-number__contents">
      <slot />
    </span>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.stop-number {
  --stop-number-color: var(--black);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--stop-number-color);
  border: 2px solid var(--stop-number-color);
  display: inline-flex;
  border-radius: 0.5rem;
  margin: 0;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  line-height: 1ch;
}
</style>
