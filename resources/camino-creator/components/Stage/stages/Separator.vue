<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="tourLanguages"
      @update:text="handleStageUpdate"
    >
      Separator Title
    </LanguageText>
  </div>
</template>
<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { LocalizedText, SeparatorStage } from "@/types";

const props = defineProps<{
  tourId: number;
  stopId: number;
  stage: SeparatorStage;
}>();

const emit = defineEmits<{
  (eventName: "update", stage: SeparatorStage);
}>();

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);

function handleStageUpdate(updatedLocalizedText: LocalizedText) {
  emit("update", {
    ...props.stage,
    text: updatedLocalizedText,
  });
}
</script>
