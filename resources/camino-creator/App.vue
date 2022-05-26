<template>
  <div class="app">
    <div v-if="!tourStore.isReady" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="tourStore.isReady" class="container py-4 h-100">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useTourStore } from "./stores/useTourStore";

const tourStore = useTourStore();
onMounted(() => tourStore.init());
</script>

<style scoped>
.app {
  background: #f3f4f6;
}
</style>
