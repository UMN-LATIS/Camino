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
  border: 1px solid #ddd;
  background: #f8fafc;
  border-radius: 0.5rem;
}
</style>
