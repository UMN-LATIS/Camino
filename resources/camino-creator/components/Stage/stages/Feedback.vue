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
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import LanguageText from "../../LanguageText.vue";

const props = defineProps({
  stage: {
    type: Object,
    required: true,
  },
  tourId: {
    type: Number,
    required: true,
  },
});

const tourStore = useCreatorStore();
const languages = tourStore.getTourLanguages(props.tourId);

const emit = defineEmits(["update"]);

function handleUpdate(change) {
  emit("update", {
    ...props.stage,
    ...change,
  });
}
</script>
