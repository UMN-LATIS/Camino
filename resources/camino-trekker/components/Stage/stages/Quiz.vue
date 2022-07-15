<template>
  <div class="quiz-stage">
    <Modal :isOpen="!!activeQuizzes.length" @close="handleModalClose">
      <StopNumber>{{ trekkerStore.stopIndex }}</StopNumber>
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
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import Modal from "@/camino-trekker/components/Modal/Modal.vue";
import StopNumber from "../../StopNumber/StopNumber.vue";

defineProps<{
  stage: QuizStage;
}>();

const trekkerStore = useTrekkerStore();
const quizStore = useQuizStore();

const activeQuizzes = computed(() =>
  quizStore.currentStopQuizzesByStatus("active")
);

function handleModalClose() {
  activeQuizzes.value.forEach((quiz) => {
    quizStore.setQuizStatus(quiz.id, "inactive");
  });
}
</script>
<style scoped></style>
