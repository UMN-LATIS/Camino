<template>
  <!-- eslint-disable vue/no-v-html -->
  <SanitizedHTML class="markdown" :html="marked.parse(content ?? '')" />
</template>

<script setup lang="ts">
import { marked } from "marked";
import type { Maybe } from "@/types";
import SanitizedHTML from "../SanitizedHTML/SanitizedHTML.vue";

defineProps<{
  content: Maybe<string>;
}>();
</script>

<style scoped>
.markdown :deep(img) {
  display: block;
  max-width: 100%;
}
</style>
