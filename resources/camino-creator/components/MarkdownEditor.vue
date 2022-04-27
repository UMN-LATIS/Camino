<template>
  <div class="markdown-editor">
    <textarea
      class="mde__textarea form-control"
      rows="4"
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
