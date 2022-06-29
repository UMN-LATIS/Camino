<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="tourLanguages"
      :largetext="true"
      @update:text="handleStageUpdate"
    >
      Guide Text
    </LanguageText>
  </div>
</template>

<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { GuideStage } from "@/types";

const props = defineProps<{
  tourId: number;
  stopId: number;
  stage: GuideStage;
}>();

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);

const emit = defineEmits<{
  (eventName: "update", stage: GuideStage);
}>();

function handleStageUpdate(updatedLocalizedText) {
  emit("update", {
    ...props.stage,
    text: updatedLocalizedText,
  });
}
</script>
