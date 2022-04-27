<template>
  <PureLanguageSelect
    :locale="locale"
    :locales="tourLocales"
    @setLocale="setLocale"
  />
</template>

<script setup>
import PureLanguageSelect from "./PureLanguageSelect.vue";
import { useLocale, useTourLocales } from "../../../common/hooks";

const { locale, setLocale } = useLocale();
const { tourLocales } = useTourLocales();
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
