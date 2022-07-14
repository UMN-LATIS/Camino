<template>
  <button
    class="btn"
    :class="{
      'btn-dark': variant === 'primary',
      'btn-outline-dark': ['default', 'secondary'].includes(variant),
      'btn-tertiary': variant === 'tertiary',
      'btn-link': variant === 'link',
    }"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "tertiary" | "link" | "default";
}

withDefaults(defineProps<Props>(), {
  variant: "default",
});
</script>

<style scoped>
.btn-outline-dark:disabled {
  background: #ddd;
  border-color: #aaa;
  color: #aaa;
}
.btn-tertiary {
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
}
</style>
