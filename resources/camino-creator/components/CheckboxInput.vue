<template>
  <div class="form-check">
    <label class="form-check-label">
      <input
        :checked="modelValue"
        type="checkbox"
        class="form-check-input"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      {{ label }}
    </label>
    <slot />
  </div>
</template>
<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  label: "Checkbox Text",
});

interface Emits {
  (eventName: "update:modelValue", isChecked: boolean);
}
defineEmits<Emits>();
</script>
