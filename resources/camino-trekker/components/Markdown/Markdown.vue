<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="markdown" v-html="cleanHtml"></div>
</template>

<script setup>
import { marked } from "marked";
import DOMPurify from "dompurify";
import pipe from "../../utils/pipe";
import { computed } from "vue";
import { string } from "vue-types";

const props = defineProps({
  content: string().def(""),
});

// parse markdown, THEN sanitize the resulting HTML
const toCleanHtml = pipe(marked.parse, DOMPurify.sanitize);
const cleanHtml = computed(() => toCleanHtml(props.content));
</script>

<style scoped>
.markdown :deep(img) {
  display: block;
  max-width: 100%;
}
</style>
