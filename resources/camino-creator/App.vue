<template>
  <router-view></router-view>
</template>
<script setup>
import { onMounted } from "vue";
import { useTourStore } from "./stores/tours";

const tourStore = useTourStore();
onMounted(() => tourStore.fetchTours());
</script>
