<template>
  <div>
    <LanguageText
      :text="stage.questionText"
      :languages="languages"
      :largetext="true"
      @update:text="(questionText) => handleUpdateStage({ questionText })"
    >
      Quiz Question Text
    </LanguageText>

    <div
      v-for="(response, index) in stage.responses"
      :key="index"
      class="bg-light p-3 my-3 position-relative"
    >
      <label>
        <button
          class="btn btn-link-dark d-inline-block position-absolute top-0 end-0"
          @click="handleRemoveResponse(index)"
        >
          <i class="fas fa-times"></i>
        </button>
        <input
          :checked="response.correct"
          type="checkbox"
          @change="
            handleUpdateResponse(index, {
              correct: ($event.target as HTMLInputElement).checked,
            })
          "
        />
        Correct
      </label>
      <LanguageText
        :text="response.text"
        :languages="languages"
        class="flex-1"
        @update:text="(text) => handleUpdateResponse(index, { text })"
      >
        Response
      </LanguageText>
    </div>

    <button class="btn btn-outline-primary mb-3" @click="handleAddResponse">
      <i class="fas fa-plus"></i> Add response
    </button>

    <LanguageText
      :text="stage.hintText"
      :languages="languages"
      :largetext="true"
      @update:text="(hintText) => handleUpdateStage({ hintText })"
    >
      Hint
    </LanguageText>
  </div>
</template>

<script setup lang="ts">
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import LanguageText from "../../LanguageText.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
import { QuizStage } from "@/types";

const props = defineProps<{
  stage: QuizStage;
  tourId: number;
}>();

const creatorStore = useCreatorStore();
const languages = creatorStore.getTourLanguages(props.tourId);

const emit = defineEmits(["update"]);

function handleUpdateStage(update) {
  emit("update", {
    ...props.stage,
    ...update,
  });
}

function handleAddResponse() {
  emit("update", {
    ...props.stage,
    responses: props.stage.responses.concat({
      text: createEmptyLocalizedText(languages.value),
      correct: false,
    }),
  });
}
function handleUpdateResponse(index, update) {
  const updatedResponse = {
    ...props.stage.responses[index],
    ...update,
  };

  emit("update", {
    ...props.stage,
    responses: [
      ...props.stage.responses.slice(0, index),
      updatedResponse,
      ...props.stage.responses.slice(index + 1),
    ],
  });
}
function handleRemoveResponse(index) {
  emit("update", {
    ...props.stage,
    responses: [
      ...props.stage.responses.slice(0, index),
      ...props.stage.responses.slice(index + 1),
    ],
  });
}
</script>
<style scoped>
.responseOutline {
  border: 1px solid lightgray;
  border-radius: 3px;
}
</style>
