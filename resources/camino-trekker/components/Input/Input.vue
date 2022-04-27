<template>
  <div
    class="input-group"
    :class="{
      'input-group--required': isRequired,
    }"
  >
    <div class="input-group__label-group">
      <label
        class="input-group__label"
        :class="{
          'sr-only': labelHidden,
        }"
        >{{ label }}</label
      >
      <small v-if="isRequired" class="input-group__corner-hint">
        Required
      </small>
    </div>
    <input class="input-group__input" v-bind="$attrs" />
    <small v-if="hint">
      {{ hint }}
    </small>
  </div>
</template>
<script setup>
import { useAttrs, computed } from "vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
  labelHidden: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "",
  },
});

const attrs = useAttrs();

const isRequired = computed(() => attrs.required !== undefined);
</script>

<style scoped>
.input-group {
  box-sizing: border-box;
  margin: 1rem 0;
}
.input-group__label-group {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.input-group__label {
  display: block;
  font-size: 0.875rem;
  color: var(--gray-700);
  font-weight: 500;
}
.input-group__corner-hint {
  color: var(--gray-500);
}

.input-group__input {
  background: var(--gray-100);
  padding: 1rem;
  border: none;
  display: block;
  width: 100%;
  border-radius: 0.25rem;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
}
</style>
