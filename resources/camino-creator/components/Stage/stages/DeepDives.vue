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
    <!-- FIXME: This is mutating the stage prop! Ignoring for now. -->
    <!-- eslint-disable -->
    <button @click="addDeepDive" class="btn btn-outline-primary">
      <!-- eslint-enable -->
      <i class="fas fa-image"></i> Add Deep Dive
    </button>
  </div>
</template>

<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
import type { DeepDiveStage, DeepDiveItem, Locale, Stage, Tour } from "@/types";

interface Props {
  stage: Stage;
  languages: Locale[];
  tour: Tour;
}

const props = defineProps<Props>();

interface Emits {
  (eventName: "update", payload: DeepDiveStage): void;
}
const emit = defineEmits<Emits>();

function addDeepDive(): void {
  const updatedStage = {
    ...props.stage,
    deepdives: props.stage.deepdives.concat({
      id: global.crypto.randomUUID(),
      title: createEmptyLocalizedText(props.languages),
      text: createEmptyLocalizedText(props.languages),
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
