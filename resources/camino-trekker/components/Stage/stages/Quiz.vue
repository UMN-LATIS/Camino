<template>
  <div class="quiz-stage">
    <Modal :isOpen="!!activeQuizzes.length" @close="handleModalClose">
      <h1>PopQuiz</h1>
      <div v-for="quiz in activeQuizzes" :key="quiz.id">
        {{ quiz }}
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { QuizStage } from "@/types";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import Modal from "@/camino-trekker/components/Modal/Modal.vue";

const quizStore = useQuizStore();

defineProps<{
  stage: QuizStage;
}>();

const activeQuizzes = computed(() =>
  quizStore.currentStopQuizzes.filter(
    (quiz: QuizStage) => quizStore.getQuizStatus(quiz.id) === "active"
  )
);

function handleModalClose() {
  activeQuizzes.value.forEach((quiz) => {
    quizStore.setQuizStatus(quiz.id, "inactive");
  });
}
</script>
<style scoped></style>
