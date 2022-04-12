<template>
  <div class="markdown-editor">
    <textarea
      class="mde__textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);
</script>

<script>
export default {
  compatConfig: { COMPONENT_V_MODEL: false },
};
</script>

<style scoped>
.mde__textarea {
  width: 100%;
  min-height: 10rem;
  padding: 1rem;
  border: none;
  background: #f0f0f0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
