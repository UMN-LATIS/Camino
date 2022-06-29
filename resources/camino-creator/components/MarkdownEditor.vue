<template>
  <div class="markdown-editor">
    <textarea
      class="mde__textarea form-control"
      rows="4"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
  }>(),
  {
    modelValue: "",
  }
);

defineEmits(["update:modelValue"]);
</script>
