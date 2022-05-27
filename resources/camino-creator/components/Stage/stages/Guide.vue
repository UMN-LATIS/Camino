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

<script setup>
import LanguageText from "../../LanguageText.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";

const props = defineProps({
  tourId: {
    type: Number,
    required: true,
  },
  stopId: {
    type: [Number, null],
    default: null,
  },
  stage: {
    type: Object,
    required: true,
  },
});

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);

const emit = defineEmits(["update"]);

function handleStageUpdate(updatedLocalizedText) {
  emit("update", {
    ...props.stage,
    text: updatedLocalizedText,
  });
}
</script>
