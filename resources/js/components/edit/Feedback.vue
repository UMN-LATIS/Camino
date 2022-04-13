<template>
  <div>
    <LanguageText :text="stage.text" :languages="languages" :largetext="true">
      Feedback Text
    </LanguageText>
  </div>
</template>

<script>
import LanguageText from "./LanguageText.vue";
export default {
  components: {
    LanguageText,
  },
  props: ["stage", "languages", "tour"],
  created() {
    if (!this.stage.text) {
      this.$set(this.stage, "text", { placeholder: null });
    }
  },
};
</script>
