<template>
  <button
    class="quiz-choice-button"
    :class="{
      'quiz-choice-button--correct': showResponseAsCorrect(quiz, response),
      'quiz-choice-button--incorrect': showResponseAsIncorrect(quiz, response),
    }"
    @click.prevent="$emit('click')"
  >
    <span class="response-item-letter">{{ toChar(index) }}</span>
    <slot />
  </button>
</template>
<script setup lang="ts">
import { QuizChoice, UserQuiz } from "@/types";

defineProps<{
  index: number;
  quiz: UserQuiz;
  response: QuizChoice;
}>();

defineEmits<{
  (eventName: "click");
}>();

function showResponseAsCorrect(quiz: UserQuiz, response: QuizChoice): boolean {
  return (
    response.correct &&
    (quiz.submittedResponses.includes(response) || quiz.isComplete)
  );
}

function showResponseAsIncorrect(
  quiz: UserQuiz,
  response: QuizChoice
): boolean {
  return (
    !response.correct &&
    (quiz.submittedResponses.includes(response) || quiz.isComplete)
  );
}

function toChar(n: number) {
  return String.fromCharCode("a".charCodeAt(0) + n);
}
</script>
<style scoped>
.quiz-choice-button {
  background: var(--white);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  color: var(--black);
}

.quiz-choice-button--incorrect {
  opacity: 0.5;
  text-decoration: line-through;
}

.quiz-choice-button--correct {
  background: var(--black);
  color: var(--white);
}
.quiz-choice-button--correct .response-item-letter {
  background: var(--white);
  color: var(--black);
}

.response-item-letter {
  text-transform: uppercase;
  font-size: 0.75rem;
  background: var(--black);
  color: var(--white);
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  line-height: 1;
  border-radius: 50%;
}
</style>
