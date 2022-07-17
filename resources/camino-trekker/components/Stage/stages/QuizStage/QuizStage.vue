<template>
  <div
    class="quiz-stage"
    :class="{
      'quiz-stage--complete': quizStore.allCurrentStopQuizzesComplete,
    }"
  >
    <Button
      class="open-quiz-button"
      icon="quiz"
      @click="quizStore.openQuizModal()"
    >
      Quiz Yourself
    </Button>

    <Modal
      :isOpen="quizStore.isQuizModalOpen"
      class="quiz-stage__modal"
      :class="{
        'quiz-stage__modal--complete': quizStore.allCurrentStopQuizzesComplete,
      }"
      @close="quizStore.closeQuizModal()"
    >
      <div class="quiz-stage__modal-contents">
        <QuizHeader :stopNumber="trekkerStore.stopIndex + 1">
          Pop Quiz
        </QuizHeader>
        <div
          v-for="quiz in quizStore.currentStopQuizzes"
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

          <QuizHint
            :quiz="quiz"
            :locale="trekkerStore.locale"
            @click="quizStore.showHint(quiz.id)"
          />
        </div>
        <!-- end quiz -->

        <footer class="quiz-stage__footer">
          <div class="quiz__message">
            {{ quizMessage }}
          </div>

          <Button
            v-if="!quizStore.allCurrentStopQuizzesComplete"
            variant="secondary"
            @click="quizStore.closeQuizModal()"
          >
            Done
          </Button>

          <Button
            v-if="quizStore.allCurrentStopQuizzesComplete"
            variant="primary"
            icon="arrow_forward"
            iconPosition="after"
            @click="handleContinueClick"
          >
            Continue
          </Button>
        </footer>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick } from "vue";
import { QuizStage } from "@/types";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import { useRouter } from "vue-router";
import Modal from "@/camino-trekker/components/Modal/Modal.vue";
import { translate as t } from "@/shared/i18n";
import Button from "@/camino-trekker/components/Button/Button.vue";
import QuizChoiceButton from "./QuizChoiceButton.vue";
import QuizHeader from "./QuizHeader.vue";
import QuizPrompt from "./QuizPrompt.vue";
import QuizHint from "./QuizHint.vue";

const props = defineProps<{
  stage: QuizStage;
}>();

const trekkerStore = useTrekkerStore();
const quizStore = useQuizStore();

const quizMessage = computed(() =>
  quizStore.allCurrentStopQuizzesComplete ? getSuccessMessage() : ""
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

const router = useRouter();
function goToNextStop() {
  return router.push(
    `/tours/${trekkerStore.tourId}/stops/${trekkerStore.stopIndex + 1}`
  );
}

function handleContinueClick() {
  quizStore.closeQuizModal();
  nextTick(goToNextStop);
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

.open-quiz-button {
  margin: 1rem 0;
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
