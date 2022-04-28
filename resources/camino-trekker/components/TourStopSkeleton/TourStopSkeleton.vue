<template>
  <div class="stop-skeleton">
    <header class="stop-skeleton__header container"></header>
    <div class="stop-skeleton__stages container">
      <div class="skeleton-block skeleton--small"></div>
      <div class="skeleton-block skeleton-block--medium"></div>
      <div class="skeleton-block skeleton-block--large"></div>
      <div class="skeleton-block skeleton-block--medium"></div>
      <div class="skeleton-block skeleton-block--large"></div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.stop-skeleton {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  overflow: none;
}
.tour-stop__stages {
  background: var(--white);
  border-radius: 2rem 2rem 0 0;
  padding-bottom: 12rem;
}
.tour-stop__prev-button {
  position: fixed;
  bottom: 5rem;
  left: 2rem;
}
.tour-stop__next-button {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
}

.skeleton-block {
  height: 1.25rem;
  width: 100%;
  margin: 1rem 0;
  background: var(--gray-light);
  background: var(--gray-lighter)
    linear-gradient(
      90deg,
      var(--gray-lighter) 0,
      #fafafa 2rem,
      var(--gray-lighter) 4rem
    );
  background-size: 10rem;
  background-position: 0 0;
  background-repeat: no-repeat;
  animation: shine-lines 1.6s infinite linear;
  border-radius: 0.5rem;
}

.skeleton-block--medium {
  height: 5rem;
}

.skeleton-block--large {
  height: 8rem;
}

.stop-skeleton__header {
  min-height: 60vh;
  background: var(--gray-lighter)
    linear-gradient(
      90deg,
      var(--gray-lighter) 0,
      #fafafa 2rem,
      var(--gray-lighter) 4rem
    );
  background-size: 10rem;
  background-position: 0 0;
  background-repeat: no-repeat;
  animation: shine-lines 1.6s infinite linear;
}

@keyframes shine-lines {
  0% {
    background-position: -100%;
  }
  40%,
  100% {
    background-position: 200%;
  }
}
</style>
