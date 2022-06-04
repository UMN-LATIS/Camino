<template>
  <div>
    <template v-if="largetext">
      <div class="row">
        <div
          v-for="(language, key) in languages"
          :key="key"
          class="form-group col"
        >
          <label :for="'field' + key + randomIdentifier" class="">
            <slot /> ({{ language }})
          </label>
          <MarkdownEditor
            v-if="largetext"
            :modelValue="translate(text, language)"
            @update:modelValue="
              (payload) => handleTextUpdate(language, payload)
            "
          />
        </div>
      </div>
    </template>
    <template v-if="!largetext">
      <div v-for="(language, key) in languages" :key="key">
        <div class="form-group row">
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
              @input="handleTextUpdate(language, ($event.target as HTMLInputElement).value)"
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
import MarkdownEditor from "./MarkdownEditor.vue";
import { Locale, LocalizedText, Maybe } from "@/types";
import { translate } from "@/shared/i18n";

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
