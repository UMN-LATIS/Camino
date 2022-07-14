<template>
  <PureLanguageSelect
    :locale="store.locale"
    :supportedLocales="store.supportedLocales"
    @setLocale="store.setLocale"
  />
</template>

<script setup lang="ts">
import PureLanguageSelect from "./PureLanguageSelect.vue";
import { useTrekkerStore } from "@trekker/stores/useTrekkerStore";

const store = useTrekkerStore();
</script>
<style scoped>
.input-group {
  display: block;
  padding: 0.5rem 0;
}

.save-button {
  margin: 1rem 0;
}
</style>
