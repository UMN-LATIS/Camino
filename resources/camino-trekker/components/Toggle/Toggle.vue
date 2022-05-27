<template>
  <div class="toggle">
    <input
      :id="name"
      class="toggle__input sr-only"
      type="checkbox"
      :checked="checked"
      :name="name"
      @change="handleInputChange($event)"
    />
    <label class="toggle__label" :for="name">
      <span class="toggle__label-text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  checked: boolean;
  name: string;
}

defineProps<Props>();

const emit = defineEmits(["change"]);

function handleInputChange(event) {
  emit("change", event);
}
</script>

<style scoped>
.toggle {
  --height: 1.5rem;
  --width: 3rem;
  --color: var(--black);
  --padding: 0.8rem;
  padding: var(--padding);
  position: relative;
  user-select: none;
  width: calc(var(--width) + 2 * var(--padding));
}
.toggle__label {
  position: relative;
  padding-top: var(--height);
  display: block;
  text-align: center;
  cursor: pointer;
  width: 100%;
}

/* toggle outline and bg */
.toggle__label::before {
  content: "";
  display: block;
  border: 1px solid var(--gray-300);
  height: var(--height);
  width: var(--width);
  border-radius: calc(var(--height) / 2);
  position: absolute;
  top: 0;
  background: var(--gray-300);
  /* center it */
  left: 50%;
  transform: translateX(-50%);
}

/* outline and bg when checked */
.toggle__input:checked ~ .toggle__label::before {
  background: var(--system-green);
  border-color: #9de1b9;
}

/* toggle circle */
.toggle__label::after {
  --circle-diameter: calc(var(--height) - 4px);
  content: "";
  display: block;
  width: var(--circle-diameter);
  height: var(--circle-diameter);
  border-radius: 50%;
  background: var(--white);
  position: absolute;
  top: 2px;
  left: 50%;
  /* center, then shift to left (off state), the nudge 2px */
  transform-origin: center;
  transform: translateX(calc(-1 * var(--width) / 2 + 2px));
  transition: 0.2s;
  box-shadow: 0 1px 10px rgb(0 0 0 / 0.25);
}
/* circle when checked */
.toggle__input:checked ~ .toggle__label::after {
  --translation: calc(var(--width) / 2 - var(--circle-diameter) - 2px);
  transform: translateX(var(--translation));
}

/* label text */
.toggle__label-text {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.4rem;
  color: var(--color);
  text-align: center;
  max-width: 100%;
  word-wrap: normal;
}
</style>
