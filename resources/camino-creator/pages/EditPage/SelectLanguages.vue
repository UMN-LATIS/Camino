<template>
  <div class="form-group row my-4">
    <label class="col-sm-2">Languages</label>
    <div class="col-sm-10 flex-wrap flex-column language-container">
      {{ modelValue }}
      <div v-for="(_, key) in possibleLanguages" :key="key" class="form-check">
        <label class="form-check-label">
          <input
            type="checkbox"
            class="form-check-input"
            :value="key"
            :checked="modelValue.includes(key)"
            @change="toggleLanguage(key)"
          />
          {{ key }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { languages as possibleLanguages } from "../../languages.js";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function toggleLanguage(key) {
  const updatedLanguageList = props.modelValue.includes(key)
    ? props.modelValue.filter((v) => v !== key) // remove key
    : [...props.modelValue, key]; // add key
  emit("update:modelValue", updatedLanguageList);
}
</script>
