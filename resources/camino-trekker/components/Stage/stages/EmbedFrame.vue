<template>
  <div class="embed-frame">
    <div v-if="stage">
      <iframe
        width="640"
        height="360"
        :src="stage.source"
        title="Embedded Player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EmbedStage } from "@/types";

interface Props {
  stage: EmbedStage;
}

defineProps<Props>();
</script>

<style scoped>
iframe {
  display: block;
  margin: 1rem 0;
  max-width: 100%;
  max-height: 70vh;
}
</style>
