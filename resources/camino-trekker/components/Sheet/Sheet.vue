<template>
  <aside class="sheet" :class="{ 'sheet--is-open': isOpen }">
    <div class="sheet__inner">
      <header class="sheet__header">
        <h2 class="sheet__title">{{ title }}</h2>
        <XButton class="sheet__close-button" @click="$emit('close')" />
      </header>
      <div class="sheet__body">
        <slot>Sheet Contents</slot>
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import XButton from "../XButton/XButton.vue";
interface Props {
  title?: string;
  isOpen?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
  isOpen: false,
});

interface Emits {
  (eventName: "close"): void;
}
defineEmits<Emits>();
</script>

<style scoped>
.sheet {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -10;
  height: 100vh;
  width: 100vw;
  transition: all ease 0.2s;
}

.sheet a {
  color: var(--gray-dark);
  text-decoration: none;
}

.sheet.sheet--is-open {
  z-index: 1000;
  /* background: rgba(0, 0, 1, 0.75); */
}
.sheet__inner {
  --scroll-track-color: transparent;
  --scroll-thumb-color: var(--gray-dark);
  --scrollbar-width: 0.5rem;
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid hsla(0, 0%, 100%, 0.8);
  background: hsla(0, 0%, 100%, 0.6);
  /* TODO: make this happen with autoprefixer */
  -webkit-backdrop-filter: blur(1.5rem);
  backdrop-filter: blur(1.5rem);
  box-shadow: 0 -10px 15px -3px rgb(0 0 0/0.1), 0 -4px 6px -4px rgb(0 0 0/0.1);

  height: 100%;
  margin-top: 2.5vh;
  overflow-y: auto;
  scrollbar-width: var(--scrollbar-width);
  scrollbar-color: var(--scroll-track-color) var(--scroll-thumb-color);
  color: var(--gray-dark);
  transform: translate3d(0, 100vh, 0);
  transition: all ease 0.2s;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.sheet__inner::-webkit-scrollbar {
  width: var(--scrollbar-width);
}
.sheet__inner::-webkit-scrollbar-track {
  background: var(--scroll-track-color);
}

.sheet__inner::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb-color);
  border-radius: 0.25rem;
  border: 2px solid var(--scroll-track-color);
}

.sheet.sheet--is-open .sheet__inner {
  transform: translate3d(0, 0, 0);
}

.sheet__header {
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;
  grid-template-rows: 2rem auto;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--gray-dark);
}
.sheet__title {
  grid-column: 1 / -1;
  grid-row: 1;
  color: var(--black);
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.sheet__close-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
}

.sheet__body {
  flex: 1;
}
</style>
