<template>
  <div class="quiz-hint">
    <button
      v-if="!quiz.showHint"
      class="quiz-hint__show-button"
      @click.prevent="$emit('click')"
    >
      <span class="material-icons"> help </span>
      <span class="quiz-hint__show-button-text">Give me a hint</span>
    </button>
    <div v-if="quiz.showHint" class="quiz-hint__text">
      <h2 class="quiz-hint__title">Hint</h2>
      <SanitizedHTML :html="t(quiz.hintText, locale)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Locale, UserQuiz } from "@/types";
import { translate as t } from "@/shared/i18n";

defineProps<{
  quiz: UserQuiz;
  locale: Locale;
}>();

defineEmits<{
  (eventName: "click");
}>();
</script>
<style scoped>
.quiz-hint__show-button {
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}
.quiz-hint__show-button-text {
  display: inline-block;
  border-bottom: 1px solid var(--black);
}

.quiz-hint__text {
  margin-top: 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0 1rem;
  background: rgba(0, 0, 0, 0.05);
}
.quiz-hint__title {
  font-size: 1rem;
  margin: 1rem 0;
}
</style>
