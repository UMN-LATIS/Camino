<template>
  <div class="form-group row my-4" data-cy="select-languages-input-group">
    <label class="col-sm-2">Languages</label>
    <div class="col-sm-10 flex-wrap flex-column language-container">
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
<script setup lang="ts">
import { languages as possibleLanguages } from "../../languages";
import { Locale } from "@/types";

const props = defineProps<{
  modelValue: Locale[];
}>();

const emit = defineEmits<{
  (eventName: "update:modelValue", locales: Locale[]);
}>();

function toggleLanguage(key) {
  const updatedLanguageList = props.modelValue.includes(key)
    ? props.modelValue.filter((v) => v !== key) // remove key
    : [...props.modelValue, key]; // add key
  emit("update:modelValue", updatedLanguageList);
}
</script>
