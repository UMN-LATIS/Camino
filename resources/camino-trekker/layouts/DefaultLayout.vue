<template>
  <div id="page-wrap">
    <TuckOnScroll>
      <AppHeader class="tour-page__app-header" />
    </TuckOnScroll>
    <slot></slot>
  </div>
</template>
<script setup>
import AppHeader from "../components/AppHeader/AppHeader.vue";
import TuckOnScroll from "../components/TuckOnScroll/TuckOnScroll.vue";
</script>
