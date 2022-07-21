<template>
  <div class="settings-page container">
    <XButton class="close-button" @click="$router.back()">Close</XButton>

    <h1>Settings</h1>

    <h2>Reset Local Storage</h2>
    <p>Reset all tours and quizzes stored within your browser.</p>
    <Button
      v-if="!isLocalStorageEmpty"
      icon="refresh"
      @click="handleStorageReset"
      >Reset</Button
    >
    <p v-if="isLocalStorageEmpty">Local storage is empty.</p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "../components/Button/Button.vue";
import XButton from "../components/XButton/XButton.vue";

const isLocalStorageEmpty = ref(false);

function handleStorageReset() {
  if (confirm("Reset Tour and Quizzes?")) {
    localStorage.clear();
    isLocalStorageEmpty.value = true;
  }
}

onMounted(() => {
  isLocalStorageEmpty.value = localStorage.length === 0;
});
</script>
<style scoped>
.settings-page {
  padding: 2rem;
  background: #f3f3f3;
  min-height: 100vh;
}
.close-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
}

h1 {
  border-bottom: 1px solid var(--black);
  padding-bottom: 1rem;
}

h2 {
  font-size: 1rem;
  text-transform: uppercase;
}
</style>
