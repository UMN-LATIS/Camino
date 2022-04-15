<template>
  <div v-if="!tourStore.isReady" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <div v-if="tourStore.isReady">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useTourStore } from "./stores/tours";

const tourStore = useTourStore();
onMounted(() => tourStore.init());
</script>
