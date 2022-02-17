<template>
  <div>
    <template v-if="largetext">
      <div class="row">
        <div
          v-for="(language, key) in languages"
          :key="key"
          class="form-group col"
        >
          <label :for="'field' + key + randomIdentifier" class=""
            ><slot /> ({{ language }})</label
          >
          <custom-markdown
            v-if="largetext"
            :text.sync="text[language]"
            :idkey="'field' + key + randomIdentifier"
          ></custom-markdown>
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
              type="text"
              class="form-control"
              v-model="text[language]"
              placeholder=""
              :id="'field' + key + randomIdentifier"
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
<script>
export default {
  props: ["languages", "text", "largetext"],
  data() {
    return {
      randomIdentifier: Math.round(Math.random() * 10000).toString(),
    };
  },
};
</script>
