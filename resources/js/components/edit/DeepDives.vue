<template>
  <div>
    <div v-for="(deepdive, key) in stage.deepdives" :key="key" class="m-2">
      <LanguageText
        :text="deepdive.title"
        :languages="languages"
        :largetext="false"
      >
        Deep Dive Title
      </LanguageText>
      <LanguageText
        :text="deepdive.text"
        :languages="languages"
        :largetext="true"
      >
        Deep Dive Text
      </LanguageText>
      <button
        v-if="deepdive.title"
        class="btn btn-outline-danger float-right"
        @click="removeDeepDive(deepdive, key)"
      >
        <i class="fas fa-trash"></i> Remove Deep Dive
      </button>
    </div>
    <!-- FIXME: This is mutating the stage prop! Ignoring for now. -->
    <!-- eslint-disable -->
    <button
      @click="
        stage.deepdives.push({
          title: { placeholder: null },
          text: { placeholder: null },
          id: uuidv4(),
        })
      "
      class="btn btn-outline-primary"
    >
      <!-- eslint-enable -->
      <i class="fas fa-image"></i> Add Deep Dive
    </button>
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
    if (!this.stage.deepdives) {
      this.$set(this.stage, "deepdives", []);
    }
  },
  methods: {
    uuidv4: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },

    removeDeepDive: function (deepdive, key) {
      if (confirm("Are you sure you wish to delete this deep dive?")) {
        // FIXME: This is mutating the stage prop!
        // eslint-disable-next-line
        this.stage.deepdives.splice(key, 1);
      }
    },
  },
};
</script>
