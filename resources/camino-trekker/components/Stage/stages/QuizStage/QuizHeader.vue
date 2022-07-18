<template>
  <header class="quiz-header">
    <StopNumber class="quiz-stage__stop-number">
      {{ stopNumber }}
    </StopNumber>
    <h1>
      <slot />
    </h1>
  </header>
</template>
<script setup lang="ts">
import StopNumber from "@/camino-trekker/components/StopNumber/StopNumber.vue";

defineProps<{
  stopNumber: number;
}>();
</script>
<style scoped>
.quiz-header {
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
.quiz-stage__stop-number {
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  font-weight: bold;
}
.quiz-header h1 {
  margin: 0;
  font-size: 1.25rem;
}
</style>
