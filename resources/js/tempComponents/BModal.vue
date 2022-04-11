<template>
  <Teleport to="body">
    <div class="modal">
      <div class="modal-inner">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
<script setup></script>
<style scoped>
.modal {
  display: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.modal-inner {
  max-width: 75vw;
  max-height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
