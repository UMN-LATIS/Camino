<template>
  <div class="guide-stage">
    <Markdown :content="markdown" />
  </div>
</template>

<script setup lang="ts">
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { GuideStage } from "@/types";
import { computed } from "vue";
import Markdown from "../../Markdown/Markdown.vue";

interface Props {
  stage: GuideStage;
}
const props = defineProps<Props>();
const store = useTrekkerStore();
const markdown = computed(() => props.stage.text?.[store.locale] ?? "");
</script>

<style scoped>
.stage-type {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
