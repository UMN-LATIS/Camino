<template>
  <div>
    <div v-for="(deepdive, index) in stage.deepdives" :key="index" class="m-2">
      <LanguageText
        :text="deepdive.title"
        :languages="languages"
        :largetext="false"
        @update:text="(title) => updateDeepDive(index as number, { title })"
      >
        Deep Dive Title
      </LanguageText>
      <LanguageText
        :text="deepdive.text"
        :languages="languages"
        :largetext="true"
        @update:text="(text) => updateDeepDive(index as number, { text })"
      >
        Deep Dive Text
      </LanguageText>
      <button
        v-if="deepdive.title"
        class="btn btn-outline-danger float-end"
        @click="removeDeepDive(index as number)"
      >
        <i class="fas fa-trash"></i> Remove Deep Dive
      </button>
    </div>
    <button class="btn btn-outline-primary" @click="addDeepDive">
      <i class="fas fa-image"></i> Add Deep Dive
    </button>
  </div>
</template>

<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
import type { DeepDiveStage, DeepDiveItem } from "@/types";
import { useCreatorStore } from "@/camino-creator/stores/useCreatorStore";

const props = defineProps<{
  stage: DeepDiveStage;
  tourId: number;
}>();

const creatorStore = useCreatorStore();
const languages = creatorStore.getTourLanguages(props.tourId);

interface Emits {
  (eventName: "update", payload: DeepDiveStage): void;
}
const emit = defineEmits<Emits>();

function addDeepDive(): void {
  const updatedStage = {
    ...props.stage,
    deepdives: props.stage.deepdives.concat({
      id: global.crypto.randomUUID(),
      title: createEmptyLocalizedText(languages.value),
      text: createEmptyLocalizedText(languages.value),
    }),
  };
  emit("update", updatedStage);
}

function updateDeepDive(index: number, update: Partial<DeepDiveItem>): void {
  const currentDeepDive: DeepDiveItem = props.stage.deepdives[index];
  const updatedStage: DeepDiveStage = {
    ...props.stage,
    deepdives: [
      ...props.stage.deepdives.slice(0, index),
      {
        ...currentDeepDive,
        ...update,
      },
      ...props.stage.deepdives.slice(index + 1),
    ],
  };

  emit("update", updatedStage);
}

function removeDeepDive(index) {
  if (!confirm("Are you sure you wish to delete this deep dive?")) {
    return;
  }

  const updatedStage: DeepDiveStage = {
    ...props.stage,
    deepdives: [
      ...props.stage.deepdives.slice(0, index),
      ...props.stage.deepdives.slice(index + 1),
    ],
  };

  emit("update", updatedStage);
}
</script>
