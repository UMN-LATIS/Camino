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
import { useTourStore } from "@creator/stores/useTourStore";

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

const tourStore = useTourStore();
const tourLanguages = tourStore.getTourLanguages(props.tourId);

const emit = defineEmits(["update"]);

function handleStageUpdate(updatedLocalizedText) {
  emit("update", {
    ...props.stage,
    text: updatedLocalizedText,
  });
}
</script>
