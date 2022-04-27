<template>
  <header
    class="stop-header"
    :class="{
      'stop-header--no-img': !imageSrc,
    }"
  >
    <div class="stop-header__content">
      <p class="stop-header__number">
        {{ stopNumber }}
      </p>
      <h2 class="stop-header__title h2">{{ title }}</h2>
      <p v-if="subtitle" class="stop-header__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
    <div class="stop-header__img-container">
      <img
        v-if="imageSrc"
        class="stop-header__img"
        :src="imageSrc"
        :alt="imageAlt"
      />
    </div>
  </header>
</template>
<script setup>
import { number, string } from "vue-types";

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  stopNumber: number().isRequired,
  imageSrc: string(),
  imageAlt: string(),
});
</script>
<style scoped>
.stop-header {
  padding: 4rem 0;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--white);
  margin-bottom: -2rem;
  text-align: center;
}

.stop-header--no-img {
  color: var(--black);
}

.stop-header__img-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--white);
}
.stop-header--no-img .stop-header__img-container:before {
  background: linear-gradient(
    90deg,
    hsla(calc(v-bind("stopNumber") * 123), 100%, 50%, 0.4) 0%,
    hsla(calc(v-bind("stopNumber") * 123 + 30), 100%, 50%, 0.2) 50%,
    hsla(calc(v-bind("stopNumber") * 123 + 60), 100%, 50%, 0) 100%
  );
}

.stop-header__img-container:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    hsla(calc(v-bind("stopNumber") * 123), 50%, 20%, 0.4) 0%,
    hsla(calc(v-bind("stopNumber") * 123 + 30), 50%, 20%, 0.2) 50%,
    hsla(calc(v-bind("stopNumber") * 123 + 60), 50%, 20%, 0) 100%
  );
}

.stop-header__img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stop-header__content {
  padding: 2rem;
  max-width: 50rem;
  margin: 0 auto;
  z-index: 1;
}

.stop-header__number {
  line-height: 1;
  font-size: 1.5rem;
  font-weight: 400;
  border: 2px solid var(--white);
  display: inline-flex;
  border-radius: 0.5rem;
  margin: 0;
  margin-bottom: 1rem;
  width: 3rem;
  height: 3rem;
  justify-content: center;
  align-items: center;
}
.stop-header--no-img .stop-header__number {
  border: 2px solid var(--black);
}

.stop-header__title {
  color: var(--white);
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
}

.stop-header--no-img .stop-header__title {
  color: var(--black);
}

.stop-header__author {
  color: hsla(0, 0%, 100%, 0.75);
}
.stop-header_details {
  color: hsla(0, 0%, 100%, 0.75);
}
</style>
