<template>
  <h3 class="separator-stage">{{ text }}</h3>
</template>
<script setup lang="ts">
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { SeparatorStage } from "@/types";
import { computed } from "vue";

interface Props {
  stage: SeparatorStage;
}

const props = defineProps<Props>();
const store = useTrekkerStore();
const text = computed(() => props.stage.text[store.locale]);
</script>
<style scoped>
.separator-stage {
  padding-top: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
