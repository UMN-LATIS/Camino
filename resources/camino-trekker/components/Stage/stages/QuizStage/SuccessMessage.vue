<template>
  <div class="success-message">
    {{ successMessage }}
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import getRandomIntInclusive from "@/camino-trekker/utils/getRandomIntInclusive";
const successMessage = computed(() => {
  const messages = [
    "Nicely done!",
    "Way to go!",
    "You're unstoppable!",
    "Brilliant!",
    "Not bad at all",
    "😎",
    "So good.",
    "⭐️ Gold Star for you",
  ];
  const randomIndex = getRandomIntInclusive(0, messages.length - 1);
  return messages[randomIndex];
});
</script>
<style scoped>
.success-message {
  font-size: 0.9rem;
}
</style>
