<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="sanitizedHtml" />
</template>
<script setup lang="ts">
import DOMPurify from "dompurify";
import { computed } from "vue";

const props = defineProps<{
  html: string;
}>();

const sanitizedHtml = computed(() => DOMPurify.sanitize(props.html));
</script>
