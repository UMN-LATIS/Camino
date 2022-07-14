<template>
  <button class="button" :class="`button--${variant}`">
    <span v-if="!!icon" class="material-icons">{{ icon }}</span>
    <span class="button__text" :class="{ 'sr-only': variant === 'icon-only' }">
      <slot>Button Text</slot>
    </span>
  </button>
</template>
<script setup lang="ts">
import type { Maybe } from "@/types";

interface Props {
  icon?: Maybe<string>;
  variant?: "primary" | "secondary" | "inverse" | "link" | "icon-only";
  iconPosition?: "before" | "after";
}

withDefaults(defineProps<Props>(), {
  icon: null,
  variant: "secondary",
  iconPosition: "before",
});
</script>
<style scoped>
.button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 0.125rem solid var(--black);
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--black);
  background-color: transparent;
  transition: all ease 0.1s;
}
.button--icon-only {
  padding: 0.5rem;
  background: var(--black);
  color: var(--white);
  border-color: var(--black);
}
.button:hover.button--icon-only {
  background: var(--white);
  color: var(--black);
  border-color: var(--white);
}

.button--icon-position-end {
  flex-direction: row-reverse;
}

.material-icons {
  font-size: 1.25rem;
}

.button:hover {
  background: hsla(0, 0%, 0%, 0.1);
}

.button--primary {
  color: var(--gray-lighter);
  border-color: var(--black);
  background: var(--black);
}
.button--primary:hover {
  outline: 0.25rem solid var(--black);
  border-color: var(--white);
  color: var(--white);
  background: var(--black);
}

.button--inverse {
  border-color: var(--white);
  color: var(--white);
}

.button--inverse:hover {
  border-color: var(--black);
  background: var(--white);
  color: var(--black);
  outline: 0.25rem solid var(--white);
}

.button--link {
  border-color: transparent;
}
</style>
