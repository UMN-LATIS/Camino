<template>
  <div class="language-stage">
    <form
      v-if="locales.length > 1"
      class="lanugage-stage__form"
      @submit.prevent="onSubmit(selectedLocale)"
    >
      <h3>Language</h3>
      <label
        v-for="(localeChoice, index) in locales"
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

<script setup>
import { ref } from "vue";
import { arrayOf, string } from "vue-types";
import Button from "../../Button/Button.vue";

const props = defineProps({
  locale: {
    type: String,
    required: true,
  },
  locales: arrayOf(string()),
});

const selectedLocale = ref(props.locale);
const handleChange = (locale) => {
  selectedLocale.value = locale;
};

const emit = defineEmits(["setLocale"]);
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
