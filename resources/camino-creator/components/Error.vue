<template>
  <div
    v-if="error"
    class="modal"
    tabindex="-1"
    role="dialog"
    style="display:block; !important"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="alert alert-danger" role="alert">
        {{ error }}. Refresh your browser. If the error continues, please
        <a href="mailto:latistecharch@umn.edu">get in touch</a>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>

<style scoped>
.modal {
  background-color: rgba(100, 100, 100, 0.3);
}
</style>
