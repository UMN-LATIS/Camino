<template>
  <Transition name="slide-fade">
    <p v-if="showAlert" class="saveAlert">
      <slot><b>Saved</b></slot>
    </p>
  </Transition>
</template>
<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{
  showAlert: boolean;
}>();

const emit = defineEmits<{
  (eventName: "update:showAlert", boolean);
}>();

watch(
  () => props.showAlert,
  (showAlert) => {
    if (!showAlert) return;
    setTimeout(() => emit("update:showAlert", false), 1500);
  }
);
</script>
<style scoped>
.saveAlert {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 0px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
