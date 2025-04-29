<template>
  <div
    class="quiz-stage"
    :class="{
      'quiz-stage--complete': quiz.isComplete,
    }"
  >
    <Button
      class="open-quiz-button"
      icon="quiz"
      @click="isQuizModalOpen = true"
    >
      Quiz
    </Button>

    <QuizModal
      :stopNumber="trekkerStore.stopIndex + 1"
      :isOpen="isQuizModalOpen"
      :isComplete="quiz.isComplete"
      @close="isQuizModalOpen = false"
    >
      <QuizQuestion :quiz="quiz" :locale="trekkerStore.locale" />
      <template #footer>
        <SuccessMessage v-if="quiz.isComplete" />

        <Button variant="secondary" @click="isQuizModalOpen = false">
          {{ quiz.isComplete ? "Done" : "Close" }}
        </Button>
      </template>
    </QuizModal>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { QuizStage } from "@/types";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import Button from "@/camino-trekker/components/Button/Button.vue";
import QuizModal from "./QuizModal.vue";
import QuizQuestion from "./QuizQuestion.vue";
import SuccessMessage from "./SuccessMessage.vue";

const props = defineProps<{
  stage: QuizStage;
}>();

const trekkerStore = useTrekkerStore();
const quizStore = useQuizStore();
const isQuizModalOpen = ref(false);

const quiz = computed(() => quizStore.quizzes[props.stage.id]);
</script>
<style scoped>
.open-quiz-button {
  margin: 1rem 0;
}
</style>
