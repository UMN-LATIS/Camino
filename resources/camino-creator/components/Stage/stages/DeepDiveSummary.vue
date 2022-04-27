<template>
  <div>
    <div class="form-check">
      <label class="form-check-label">
        <input
          type="checkbox"
          class="form-check-input"
          :checked="stage.request_email"
          @change="handleUpdate({ request_email: $event.target.checked })"
        />
        Request Email Addresses
      </label>
    </div>
    <LanguageText
      :text="stage.text"
      :languages="languages"
      :largetext="true"
      @update:text="(text) => handleUpdate({ text })"
    >
      Deep Dive Text
    </LanguageText>
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
  emits: ["update"],
  methods: {
    handleUpdate(change) {
      this.$emit("update", {
        ...this.stage,
        ...change,
      });
    },
  },
};
</script>
