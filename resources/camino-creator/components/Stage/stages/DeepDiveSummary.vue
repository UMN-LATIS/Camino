<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="languages"
      :largetext="true"
      @update:text="(text) => handleUpdate({ text })"
    >
      Deep Dive Text
    </LanguageText>
  </div>
</template>

<script setup lang="ts">
import { DeepDiveSummaryStage } from "@/types";
import LanguageText from "../../LanguageText.vue";
import { useCreatorStore } from "@/camino-creator/stores/useCreatorStore";

const props = defineProps<{
  stage: DeepDiveSummaryStage;
  tourId: number;
}>();

const creatorStore = useCreatorStore();
const languages = creatorStore.getTourLanguages(props.tourId);

const emit = defineEmits<{
  (eventName: "update", updatedStage: DeepDiveSummaryStage);
}>();

function handleUpdate(change) {
  emit("update", {
    ...props.stage,
    ...change,
  });
}
</script>
