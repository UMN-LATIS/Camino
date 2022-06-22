<template>
  <div class="app">
    <div class="container py-4 h-100">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useCreatorStore } from "./stores/useCreatorStore";

const creatorStore = useCreatorStore();
onMounted(() => creatorStore.init());
</script>

<style scoped>
.app {
  background: #f3f4f6;
}
</style>
