<template>
  <div class="guide-stage">
    <Markdown :content="markdown" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { shape } from "vue-types";
import Markdown from "../../Markdown/Markdown.vue";

const props = defineProps({
  stage: shape({
    // I18n object like: { en: 'hello', es: 'hola'}
    text: Object,
  }).loose,
  locale: {
    type: String,
    default: "en",
  },
});
const markdown = computed(() => props.stage.text[props.locale]);
</script>

<style scoped>
.stage-type {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
