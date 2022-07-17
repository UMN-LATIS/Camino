<template>
  <Modal
    :isOpen="isOpen"
    class="quiz-stage__modal"
    :class="{
      'quiz-stage__modal--complete': isComplete,
    }"
    @close="$emit('close')"
  >
    <div class="quiz-stage__modal-contents">
      <QuizHeader :stopNumber="stopNumber">Pop Quiz</QuizHeader>
      <slot />
      <footer class="quiz-stage__footer">
        <slot name="footer">
          <Button variant="secondary" @click="$emit('close')">Done</Button>
        </slot>
      </footer>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "@trekker/components/Modal/Modal.vue";
import QuizHeader from "./QuizHeader.vue";
import Button from "@trekker/components/Button/Button.vue";
defineProps<{
  isComplete: boolean;
  isOpen: boolean;
  stopNumber: number;
}>();

defineEmits<{
  (eventName: "close");
}>();
</script>
<style scoped>
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
