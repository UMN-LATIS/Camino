<template>
  <div class="form-check">
    <label class="form-check-label">
      <input
        :checked="modelValue"
        type="checkbox"
        class="form-check-input"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      {{ label }}
    </label>
    <slot />
  </div>
</template>
<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Checkbox Text",
  },
});
defineEmits(["update:modelValue"]);
</script>
