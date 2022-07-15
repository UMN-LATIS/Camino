<template>
  <div class="quiz-stage">
    <Modal>
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
  tourId: number;
  stopId: number;
}>();

const activeQuizzes = computed(() =>
  quizStore.currentStopQuizzes.filter((quiz) => quiz.status === "complete")
);
</script>
<style scoped></style>
