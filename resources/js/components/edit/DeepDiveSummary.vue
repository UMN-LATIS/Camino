<template>
  <div>
    <div class="form-check">
      <label class="form-check-label">
        <!-- FIXME: This is mutating the stage prop! Ignoring for now. -->
        <!-- eslint-disable -->
        <input
          type="checkbox"
          class="form-check-input"
          v-model="stage.request_email"
        />
        <!-- eslint-enable -->
        Request Email Addresses
      </label>
    </div>
    <language-text :text="stage.text" :languages="languages" :largetext="true">
      Deep Dive Text
    </language-text>
  </div>
</template>

<script>
export default {
  props: ["stage", "languages", "tour"],
  created() {
    if (!this.stage.text) {
      this.$set(this.stage, "text", { placeholder: null });
      this.$set(this.stage, "request_email", true);
    }
  },
};
</script>
