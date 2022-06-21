<template>
  <div class="app">
    <Spinner v-if="!creatorStore.isReady" />
    <div v-else class="container py-4 h-100">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useCreatorStore } from "./stores/useCreatorStore";
import Spinner from "./components/Spinner.vue";

const creatorStore = useCreatorStore();
onMounted(() => creatorStore.init());
</script>

<style scoped>
.app {
  background: #f3f4f6;
}
</style>
