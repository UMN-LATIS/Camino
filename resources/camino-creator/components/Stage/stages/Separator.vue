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
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { shape, string, object } from "vue-types";

const props = defineProps({
  tourId: {
    type: Number,
    required: true,
  },
  stopId: {
    type: [Number, null],
    default: null,
  },
  stage: shape({
    id: string().isRequired,
    type: "separator".isRequired,
    text: object(),
  }),
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
