<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="markdown" v-html="cleanHtml"></div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { sanitize } from "dompurify";
import { pipe } from "ramda";
import { computed } from "vue";
import type { Maybe } from "@/types";

interface Props {
  content: Maybe<string>;
}

const props = defineProps<Props>();

// parse markdown, THEN sanitize the resulting HTML
const toCleanHtml = pipe(marked.parse, sanitize);
const cleanHtml = computed(() => toCleanHtml(props.content ?? ""));
</script>

<style scoped>
.markdown :deep(img) {
  display: block;
  max-width: 100%;
}
</style>
