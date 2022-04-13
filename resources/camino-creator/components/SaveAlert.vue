<template>
  <Transition name="slide-fade">
    <p v-if="showAlert" class="saveAlert">
      <slot><b>Saved</b></slot>
    </p>
  </Transition>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["showAlert"],
  emits: ["update:showAlert"],
  watch: {
    showAlert: function (value) {
      if (value == true) {
        setTimeout(() => {
          this.$emit("update:showAlert", false);
        }, 1500);
      }
    },
  },
};
</script>
<style scoped>
.saveAlert {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 0px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
