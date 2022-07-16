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
        <QuizHeader :stopNumber="trekkerStore.stopIndex + 1">
          Pop Quiz
        </QuizHeader>
        <div
          v-for="quiz in activeOrCompleteQuizzes"
          :key="quiz.id"
          class="quiz-question"
        >
          <QuizPrompt
            :content="quiz.questionText"
            :locale="trekkerStore.locale"
          />

          <div class="quiz-question__response-list">
            <QuizChoiceButton
              v-for="(response, index) in quiz.responses"
              :key="index"
              :index="index"
              :quiz="quiz"
              :response="response"
              @click="quizStore.submitQuizResponse(quiz.id, response)"
            >
              {{ t(response.text, trekkerStore.locale) }}
            </QuizChoiceButton>
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
import { QuizStage } from "@/types";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import Modal from "@/camino-trekker/components/Modal/Modal.vue";
import { translate as t } from "@/shared/i18n";
import SanitizedHTML from "@/camino-trekker/components/SanitizedHTML/SanitizedHTML.vue";
import Button from "@/camino-trekker/components/Button/Button.vue";
import { useRouter } from "vue-router";
import { nextTick } from "process";
import QuizChoiceButton from "./QuizChoiceButton.vue";
import QuizHeader from "./QuizHeader.vue";
import QuizPrompt from "./QuizPrompt.vue";

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
.quiz-question__response-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 0.5rem;
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
