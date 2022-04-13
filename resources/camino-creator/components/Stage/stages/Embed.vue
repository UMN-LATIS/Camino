<template>
  <div>
    <LanguageText :text="stage.buttonTitle" :languages="languages">
      Embed Button Title
    </LanguageText>
    <div class="form-group row">
      <label for="url" class="col-sm-2 col-form-label">URL</label>
      <div class="col-sm-6">
        <!-- FIXME: stage.source as a model will mutate the stage prop! -->
        <!-- eslint-disable -->
        <input
          type="text"
          id="url"
          class="form-control"
          v-model="stage.source"
          aria-describedby="helpId"
          placeholder=""
        />
        <!-- eslint-enable -->
        <small id="helpId" class="form-text text-muted"
          >Just the web address, with http or https://</small
        >
      </div>
    </div>
  </div>
</template>

<script>
import LanguageText from "../../LanguageText.vue";
export default {
  components: {
    LanguageText,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour"],
  created() {
    if (!this.stage.buttonTitle) {
      this.$set(this.stage, "buttonTitle", { English: "Show Embed" });
      this.$set(this.stage, "url", null);
    }
  },
};
</script>
<style>
.css-icon {
  -webkit-border-radius: 30px;
  height: 10px;
  width: 10px;
  z-index: 10;
}

.target-css-icon {
  border: 3px solid red;
  background-color: red;
}
</style>
