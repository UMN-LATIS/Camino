<template>
  <div
    class="quiz-stage"
    :class="{
      'quiz-stage--complete': quizStore.allCurrentStopQuizzesComplete,
    }"
  >
    <QuizModal
      :stopNumber="trekkerStore.stopIndex + 1"
      :isOpen="isOpen"
      :isComplete="isComplete"
      @close="$emit('close')"
    >
      <QuizQuestion
        v-for="quiz in quizStore.currentStopQuizzes"
        :key="quiz.id"
        :quiz="quiz"
        :locale="trekkerStore.locale"
      />
      <template #footer>
        <div v-if="!isComplete" class="modal__footer">
          <div class="button-message">Complete all questions to continue.</div>

          <Button v-if="!isComplete" variant="secondary" icon="lock" disabled>
            Continue
          </Button>
        </div>
        <div v-if="isComplete" class="modal__footer">
          <SuccessMessage class="button-message" />
          <Button
            v-if="quizStore.allCurrentStopQuizzesComplete"
            variant="primary"
            icon="arrow_forward"
            iconPosition="after"
            @click="handleContinueClick"
          >
            Continue
          </Button>
        </div>
      </template>
    </QuizModal>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick } from "vue";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import { useRouter } from "vue-router";
import Button from "@/camino-trekker/components/Button/Button.vue";
import QuizModal from "./QuizModal.vue";
import QuizQuestion from "./QuizQuestion.vue";
import SuccessMessage from "./SuccessMessage.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (eventName: "close");
}>();

const trekkerStore = useTrekkerStore();
const quizStore = useQuizStore();

const isComplete = computed(() => quizStore.allCurrentStopQuizzesComplete);

const router = useRouter();
function goToNextStop() {
  return router.push(
    `/tours/${trekkerStore.tourId}/stops/${trekkerStore.stopIndex + 1}`
  );
}

function handleContinueClick() {
  emit("close");
  nextTick(goToNextStop);
}
</script>
<style scoped>
.open-quiz-button {
  margin: 1rem 0;
}

.button-message {
  font-size: 0.9rem;
}

.modal__footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
