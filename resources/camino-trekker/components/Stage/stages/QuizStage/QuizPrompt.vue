<template>
  <div class="quiz-question__prompt" data-cy="quiz-prompt">
    <SanitizedHTML :html="t(content, locale)" />
  </div>
</template>
<script setup lang="ts">
import { LocalizedText, Locale } from "@/types";
import { translate as t } from "@/shared/i18n";
import SanitizedHTML from "@trekker/components/SanitizedHTML/SanitizedHTML.vue";

defineProps<{
  content: LocalizedText;
  locale: Locale;
}>();
</script>
<style scoped>
.quiz-question__prompt {
  font-weight: 500;
  font-size: 1.25rem;
  margin: 2rem 1rem;
  color: var(--black);
  text-align: center;
}
</style>
