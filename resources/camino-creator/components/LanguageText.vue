<template>
  <div>
    <template v-if="largetext">
      <div class="language-text__editor">
        <div
          v-for="(language, key) in languages"
          :key="key"
          class="d-flex flex-column"
        >
          <label :for="'field' + key + randomIdentifier" class="">
            <slot /> ({{ language }})
          </label>
          <VEditor
            v-if="largetext"
            :modelValue="translate(text, language)"
            class="flex-grow-1"
            @update:modelValue="
              (payload) => handleTextUpdate(language, payload)
            "
          />
        </div>
      </div>
    </template>
    <template v-if="!largetext">
      <div v-for="(language, key) in languages" :key="key">
        <div class="form-group row my-1">
          <label
            :for="'field' + key + randomIdentifier"
            class="col-sm-2 col-form-label"
            ><slot /> ({{ language }})</label
          >
          <div class="col-sm-10">
            <input
              :id="'field' + key + randomIdentifier"
              type="text"
              class="form-control"
              :value="translate(text, language)"
              @input="
                handleTextUpdate(
                  language,
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </div>
          <div class="col-sm-4">
            <slot name="languageaddon"></slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { Locale, LocalizedText, Maybe } from "@/types";
import { translate } from "@/shared/i18n";
import VEditor from "./VEditor.vue";

interface Props {
  languages: Locale[];
  text: Maybe<LocalizedText>;
  largetext?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  largetext: false,
});

const emit = defineEmits(["update:text"]);

const randomIdentifier = Math.round(Math.random() * 10000).toString();

function handleTextUpdate(language: Locale, updatedText: string) {
  const updatedTextObj = {
    ...props.text,
    [language]: updatedText,
  };
  emit("update:text", updatedTextObj);
}
</script>
<style scoped>
.language-text__editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
</style>
