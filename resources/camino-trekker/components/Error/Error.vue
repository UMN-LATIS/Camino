<template>
  <div class="error">
    <i class="material-icons">error</i>
    <slot />
  </div>
</template>
<script setup></script>
<style>
.error {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fef1f2;
  color: #9d2120;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #9d2120;
  border-radius: 0.25rem;
}
</style>
