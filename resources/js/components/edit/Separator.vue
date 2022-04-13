<template>
  <div>
    <LanguageText :text="stage.text" :languages="languages">
      Separator Title
    </LanguageText>
  </div>
</template>
<script>
import LanguageText from "./LanguageText.vue";

export default {
  components: {
    LanguageText,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages"],
  created() {
    if (!this.stage.text) {
      this.$set(this.stage, "text", { placeholder: null });
    }
  },
};
</script>
