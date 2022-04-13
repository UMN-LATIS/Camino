<template>
  <button class="btn btn-outline-dark">
    <slot />
  </button>
</template>
<script>
export default {
  compatConfig: {
    MODE: 3, // opt-in to Vue 3 behavior for this component only
  },
};
</script>
