<template>
  <div class="quiz-stage">
    <Button
      v-if="quizStore.isCurrentStopDone"
      @click="quizStore.removeCurrentStopFromDoneList()"
      >Show Quiz Again</Button
    >

    <Modal
      :isOpen="!!activeOrCompleteQuizzes.length && !quizStore.isCurrentStopDone"
      class="quiz-stage__modal"
      :class="{
        'quiz-stage__modal--complete': quizStore.allCurrentStopQuizzesComplete,
      }"
      @close="handleModalClose"
    >
      <div class="quiz-stage__modal-contents">
        <header class="quiz-header">
          <StopNumber class="quiz-stage__stop-number">{{
            trekkerStore.stopIndex + 1
          }}</StopNumber>
          <h1>Pop Quiz</h1>
        </header>
        <div
          v-for="quiz in activeOrCompleteQuizzes"
          :key="quiz.id"
          class="quiz-question"
        >
          <div class="quiz-question__prompt">
            <SanitizedHTML :html="t(quiz.questionText, trekkerStore.locale)" />
          </div>

          <div class="quiz-question__response-list">
            <button
              v-for="(response, index) in quiz.responses"
              :key="index"
              class="quiz-choice-button"
              :class="{
                'quiz-choice-button--correct': showResponseAsCorrect(
                  quiz,
                  response
                ),
                'quiz-choice-button--incorrect': showResponseAsIncorrect(
                  quiz,
                  response
                ),
              }"
              @click="quizStore.submitQuizResponse(quiz.id, response)"
            >
              <span class="response-item-letter">{{ toChar(index) }}</span>
              {{ t(response.text, trekkerStore.locale) }}
            </button>
          </div>

          <div class="quiz-hint">
            <button
              v-if="!quiz.showHint"
              class="quiz-hint__show-button"
              @click="quizStore.showHint(quiz.id)"
            >
              <span class="material-icons"> help </span>
              <span class="quiz-hint__show-button-text">Give me a hint</span>
            </button>
            <div v-if="quiz.showHint" class="quiz-hint__text">
              <h2 class="quiz-hint__title">Hint</h2>
              <SanitizedHTML :html="t(quiz.hintText, trekkerStore.locale)" />
            </div>
          </div>
          <!-- {{ quiz }} -->
        </div>
        <!-- end quiz -->

        <footer class="quiz-stage__footer">
          <div class="quiz__message">
            {{ quizMessage }}
          </div>

          <Button
            v-if="!quizStore.allCurrentStopQuizzesComplete"
            variant="primary"
            icon="lock"
            iconPosition="after"
            disabled
            >Continue</Button
          >

          <Button
            v-if="quizStore.allCurrentStopQuizzesComplete"
            variant="primary"
            icon="arrow_forward"
            iconPosition="after"
            @click="handleContinueClick"
            >Continue</Button
          >
        </footer>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { QuizChoice, QuizStage, UserQuiz } from "@/types";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import Modal from "@/camino-trekker/components/Modal/Modal.vue";
import StopNumber from "@/camino-trekker/components/StopNumber/StopNumber.vue";
import { translate as t } from "@/shared/i18n";
import SanitizedHTML from "@/camino-trekker/components/SanitizedHTML/SanitizedHTML.vue";
import Button from "@/camino-trekker/components/Button/Button.vue";
import { useRouter } from "vue-router";
import { nextTick } from "process";

const props = defineProps<{
  stage: QuizStage;
}>();

const trekkerStore = useTrekkerStore();
const quizStore = useQuizStore();
const router = useRouter();

const activeOrCompleteQuizzes = computed(() =>
  quizStore
    .currentStopQuizzesByStatus("active")
    .concat(quizStore.currentStopQuizzesByStatus("complete"))
);

const quizMessage = computed(() =>
  quizStore.allCurrentStopQuizzesComplete
    ? getSuccessMessage()
    : "The next stop is locked"
);

function getSuccessMessage() {
  const messages = [
    "Nicely done!",
    "Way to go!",
    "You're unstoppable!",
    "Brilliant!",
    "Not bad at all",
  ];
  // get a pseudo random message, but we want it to be somewhat consistent
  // for a given stage. So, we use stage length (mod message length)
  const randomIndex = JSON.stringify(props.stage).length % messages.length;
  return messages[randomIndex];
}

function toChar(n: number) {
  return String.fromCharCode("a".charCodeAt(0) + n);
}

function showResponseAsCorrect(quiz: UserQuiz, response: QuizChoice): boolean {
  return (
    response.correct &&
    (quiz.submittedResponses.includes(response) || quiz.status === "complete")
  );
}

function showResponseAsIncorrect(
  quiz: UserQuiz,
  response: QuizChoice
): boolean {
  return (
    !response.correct &&
    (quiz.submittedResponses.includes(response) || quiz.status === "complete")
  );
}

function handleContinueClick() {
  // unlock next stop
  quizStore.addCurrentStopToDoneList();

  // then go
  nextTick(() => {
    return router.push(
      `/tours/${trekkerStore.tourId}/stops/${trekkerStore.stopIndex + 1}`
    );
  });
}

function handleModalClose() {
  activeOrCompleteQuizzes.value.forEach((quiz) => {
    quizStore.setQuizStatus(quiz.id, "inactive");
  });
}
</script>
<style scoped>
/* .quiz-stage__modal-contents {
  padding-top: 2rem;
} */
.quiz-header {
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
.quiz-stage__stop-number {
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  font-weight: bold;
}
.quiz-header h1 {
  margin: 0;
  /* font-weight: 500; */
  font-size: 1.25rem;
}
.quiz-question__prompt {
  font-weight: 500;
  font-size: 1.25rem;
  margin: 2rem 1rem;
  color: var(--black);
  text-align: center;
}

.quiz-question__response-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 0.5rem;
}

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

.quiz-stage__footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
<style>
.modal .quiz-stage__modal {
  background: linear-gradient(180deg, #f3ff7d 0%, #ffea7d 98.29%);
}

.modal .quiz-stage__modal--complete {
  background: linear-gradient(180deg, #7dff82 0%, #7dffb1 100%);
}
</style>
