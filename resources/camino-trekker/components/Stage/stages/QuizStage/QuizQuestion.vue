<template>
  <div class="quiz-question">
    <QuizPrompt :content="quiz.questionText" :locale="locale" />

    <div class="quiz-question__response-list">
      <QuizChoiceButton
        v-for="(response, index) in quiz.responses"
        :key="index"
        :index="index"
        :quiz="quiz"
        :response="response"
        @click="quizStore.submitQuizResponse(quiz.id, response)"
      >
        {{ t(response.text, locale) }}
      </QuizChoiceButton>
    </div>

    <QuizHint
      :quiz="quiz"
      :locale="locale"
      @click="quizStore.showHint(quiz.id)"
    />
  </div>
</template>
<script setup lang="ts">
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import { translate as t } from "@/shared/i18n";
import { Locale, UserQuiz } from "@/types";
import QuizPrompt from "./QuizPrompt.vue";
import QuizChoiceButton from "./QuizChoiceButton.vue";
import QuizHint from "./QuizHint.vue";

defineProps<{
  quiz: UserQuiz;
  locale: Locale;
}>();

const quizStore = useQuizStore();
</script>
<style scoped>
.quiz-question__response-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 0.5rem;
}
</style>
