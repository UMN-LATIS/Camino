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
          <!-- FIXME: This mutates the text prop! -->
          <!-- eslint-disable -->
          <MarkdownEditor v-if="largetext" v-model="text[language]" />
          <!-- eslint-enable -->
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
            <!-- FIXME: This mutates the text prop! -->
            <!-- eslint-disable -->
            <input
              type="text"
              class="form-control"
              v-model="text[language]"
              placeholder=""
              :id="'field' + key + randomIdentifier"
            />
            <!-- eslint-disable  -->
          </div>
          <div class="col-sm-4">
            <slot name="languageaddon"></slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import MarkdownEditor from "./MarkdownEditor.vue";

export default {
  components: {
    MarkdownEditor,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["languages", "text", "largetext"],
  data() {
    return {
      randomIdentifier: Math.round(Math.random() * 10000).toString(),
    };
  },
};
</script>
