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
import { DeepDiveSummaryStage, Locale, Tour } from "@/types";
import LanguageText from "../../LanguageText.vue";

const props = defineProps<{
  stage: DeepDiveSummaryStage;
  languages: Locale[];
  tour: Tour;
}>();

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
