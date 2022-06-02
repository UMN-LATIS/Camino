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
            :modelValue="t(text, language)"
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
              :value="text[language]"
              @input="handleTextUpdate(language, $event.target.value)"
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
<script setup>
import MarkdownEditor from "./MarkdownEditor.vue";

const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
  // FIXME: text is actually a localized text object of the form
  // { 'en': 'Hello', 'es': 'Hola' }
  // currently it's not using two-letter locale codes.
  text: {
    type: Object,
    required: true,
  },
  // FIXME: unclear that this is a boolean to turn this into a textarea in
  // perhaps just make a separate textare component?
  largetext: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:text"]);

const randomIdentifier = Math.round(Math.random() * 10000).toString();

function handleTextUpdate(language, updatedText) {
  const updatedTextObj = {
    ...props.text,
    [language]: updatedText,
  };
  emit("update:text", updatedTextObj);
}
</script>
