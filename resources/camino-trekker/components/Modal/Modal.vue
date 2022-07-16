<template>
  <Teleport to="body">
    <div ref="modal" class="modal" :class="{ 'modal--is-open': isOpen }">
      <div class="modal__contents" v-bind="$attrs">
        <XButton class="modal__close-button" @click="$emit('close')" />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import XButton from "../XButton/XButton.vue";

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (eventName: "close"): void;
}>();

const modal = ref<HTMLDivElement>();
</script>
<style scoped>
.modal {
  display: none;
}
.modal.modal--is-open {
  display: flex;
  background: rgba(0, 0, 0, 0.66);
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__contents {
  background: #f3f3f3;
  border: 1px solid transparent;
  position: absolute;
  max-height: 90vh;
  width: 90vw;
  max-width: 40rem;

  overflow: auto;
  padding: 2rem;
  border-radius: 1rem;
}
.modal__close-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
}
</style>
