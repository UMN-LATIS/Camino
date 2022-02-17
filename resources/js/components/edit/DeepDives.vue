<template>
  <div>
    <div v-for="(deepdive, key) in stage.deepdives" :key="key" class="m-2">
      <language-text
        :text="deepdive.title"
        :languages="languages"
        :largetext="false"
      >
        Deep Dive Title
      </language-text>
      <language-text
        :text="deepdive.text"
        :languages="languages"
        :largetext="true"
      >
        Deep Dive Text
      </language-text>
      <button
        @click="removeDeepDive(deepdive, key)"
        class="btn btn-outline-danger float-right"
        v-if="deepdive.title"
      >
        <i class="fas fa-trash"></i> Remove Deep Dive
      </button>
    </div>
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
      <i class="fas fa-image"></i> Add Deep Dive
    </button>
  </div>
</template>

<script>
export default {
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
        this.stage.deepdives.splice(key, 1);
      }
    },
  },
};
</script>
