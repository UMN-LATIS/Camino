<template>
  <button
    class="btn"
    :class="{
      'btn-outline-dark': variant === 'default',
      'btn-dark': variant === 'primary',
    }"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
interface Props {
  variant?: "primary" | "default";
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
</style>
