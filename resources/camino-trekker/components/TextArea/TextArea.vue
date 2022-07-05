<template>
  <div class="textarea-group">
    <div class="textarea-group__label-group">
      <label class="textarea-group__label">{{ label }}</label>
      <small v-if="isRequired" class="textarea-group__corner-hint">
        Required
      </small>
    </div>
    <div class="mt-1">
      <textarea
        rows="4"
        class="textarea-group__input"
        v-bind="$attrs"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <small v-if="hint">
        {{ hint }}
      </small>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAttrs, computed } from "vue";

withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    hint?: string;
  }>(),
  {
    hint: "",
    modelValue: "",
  }
);

defineEmits<{
  (eventName: "update:modelValue", value: string);
}>();
const attrs = useAttrs();

const isRequired = computed(() => attrs.required !== undefined);
</script>

<style scoped>
.textarea-group {
  box-sizing: border-box;
  margin: 1rem 0;
}
.textarea-group__label-group {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.textarea-group__label {
  display: block;
  font-size: 0.875rem;
  color: var(--gray-700);
  font-weight: 500;
}
.textarea-group__corner-hint {
  color: var(--gray-500);
}

.textarea-group__input {
  background: var(--gray-100);
  padding: 1rem;
  border: none;
  display: block;
  width: 100%;
  border-radius: 0.25rem;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
  resize: vertical;
}
</style>
