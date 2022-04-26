<template>
  <div>
    <div v-for="(deepdive, index) in stage.deepdives" :key="index" class="m-2">
      <LanguageText
        :text="deepdive.title"
        :languages="languages"
        :largetext="false"
        @update:text="(title) => updateDeepDive(index, { title })"
      >
        Deep Dive Title
      </LanguageText>
      <LanguageText
        :text="deepdive.text"
        :languages="languages"
        :largetext="true"
        @update:text="(text) => updateDeepDive(index, { text })"
      >
        Deep Dive Text
      </LanguageText>
      <button
        v-if="deepdive.title"
        class="btn btn-outline-danger float-right"
        @click="removeDeepDive(index)"
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

<script>
import LanguageText from "../../LanguageText.vue";
import { createMultilingualText } from "./stageFactory";

export default {
  components: {
    LanguageText,
  },
  props: ["stage", "languages", "tour"],
  emits: ["update"],
  methods: {
    addDeepDive() {
      const updatedStage = {
        ...this.stage,
        deepdives: this.stage.deepdives.concat({
          id: global.crypto.randomUUID(),
          title: createMultilingualText(this.languages),
          text: createMultilingualText(this.languages),
        }),
      };

      this.$emit("update", updatedStage);
    },
    updateDeepDive(index, update) {
      const currentDeepDive = this.stage.deepdives[index];
      const updatedStage = {
        ...this.stage,
        deepdives: [
          ...this.stage.deepdives.slice(0, index),
          {
            ...currentDeepDive,
            ...update,
          },
          ...this.stage.deepdives.slice(index + 1),
        ],
      };

      this.$emit("update", updatedStage);
    },
    removeDeepDive(index) {
      if (!confirm("Are you sure you wish to delete this deep dive?")) {
        return;
      }

      const updatedStage = {
        ...this.stage,
        deepdives: [
          ...this.stage.deepdives.slice(0, index),
          ...this.stage.deepdives.slice(index + 1),
        ],
      };

      this.$emit("update", updatedStage);
    },
  },
};
</script>
