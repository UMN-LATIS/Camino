<template>
  <div v-show="show" class="alert" :class="`alert--${variant}`">
    <div class="alert__icon">
      <i class="material-icons">{{ icon }}</i>
    </div>

    <div class="alert__text">
      <slot>You have been alerted.</slot>
    </div>

    <button
      v-if="dismissable"
      class="alert__close-button"
      @click="handleDismiss"
    >
      <i class="material-icons">close</i>
      <span class="sr-only">Dismiss Alert</span>
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "info",
  },
  dismissable: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: "info",
  },
});

const show = ref(true);
function handleDismiss() {
  if (!props.dismissable) return;
  show.value = false;
}
</script>
<style scoped>
.alert {
  padding: 1.2rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  color: #1d4ed8;
  background: #eff6ff;
}
.alert__icon {
  display: inline-flex;
}
.alert__text {
  flex: 1;
}

.alert__close-button {
  display: inline-flex;
  background: none;
  border: none;
  justify-content: center;
}

.alert__close-button:hover {
  background: rgb(0 0 0 / 5%);
  border-radius: 0.5rem;
}
.alert__close-button:hover .material-icons {
  color: var(--black);
}

.alert__icon {
  color: #3b82f6;
}

.alert--warning {
  background: #fefce8;
  color: #a16207;
}
.alert--warning .alert__icon {
  color: #eab308;
}
.alert--warning .alert__close-button {
  color: #eab308;
}
</style>
