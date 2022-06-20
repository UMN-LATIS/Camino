<template>
  <div class="language-stage">
    <form
      v-if="supportedLocales.length > 1"
      class="lanugage-stage__form"
      @submit.prevent="onSubmit(selectedLocale)"
    >
      <h3>Language</h3>
      <label
        v-for="(localeChoice, index) in supportedLocales"
        :key="index"
        class="input-group"
      >
        <input
          name="locale"
          type="radio"
          :value="localeChoice"
          :checked="selectedLocale === localeChoice"
          @change="handleChange(localeChoice)"
        />
        {{ locale }}
      </label>
      <Button class="save-button" type="submit" variant="primary">Save</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Locale } from "@/types";
import Button from "../../Button/Button.vue";
interface Props {
  locale: Locale;
  supportedLocales: Locale[];
}

const props = defineProps<Props>();

const selectedLocale = ref(props.locale);
const handleChange = (locale) => {
  selectedLocale.value = locale;
};

interface Emits {
  (eventName: "setLocale", payload: Locale);
}
const emit = defineEmits<Emits>();
const onSubmit = (selected) => emit("setLocale", selected);
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
