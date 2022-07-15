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
  font-size: 1.5rem;
  font-weight: 400;
  border: 2px solid var(--white);
  display: inline-flex;
  border-radius: 0.5rem;
  margin: 0;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  line-height: 1ch;
}
</style>
