<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="languages"
      :largetext="true"
      @update:text="(text) => handleUpdate({ text })"
    >
      Feedback Text
    </LanguageText>
  </div>
</template>

<script setup lang="ts">
import { FeedbackStage } from "@/types";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import LanguageText from "../../LanguageText.vue";

const props = defineProps<{
  stage: FeedbackStage;
  tourId: number;
}>();

const emit = defineEmits<{
  (eventName: "update", stage: FeedbackStage);
}>();

const creatorStore = useCreatorStore();
const languages = creatorStore.getTourLanguages(props.tourId);

function handleUpdate(change) {
  emit("update", {
    ...props.stage,
    ...change,
  });
}
</script>
