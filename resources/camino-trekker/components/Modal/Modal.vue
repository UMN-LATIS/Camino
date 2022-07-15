<template>
  <dialog>
    I'm a dialog!
    <slot />
    <form method="dialog">
      <input type="submit" value="Close" />
    </form>
  </dialog>
</template>
<script setup>
import dialogPolyfill from "dialog-polyfill";
const dialog = document.querySelector("dialog");

dialogPolyfill.registerDialog(dialog);
</script>
<style scoped>
@import "dialog-polyfill/dist/dialog-polyfill.css";
</style>
