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
<script setup>
import LanguageText from "../../LanguageText.vue";
import { useTourStore } from "../../../stores/tours.js";

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

function handleStageUpdate(updatedText) {
  tourStore.updateTourStopStage(props.tourId, props.stopId, {
    ...props.stage,
    text: updatedText,
  });
}
</script>
