<template>
  <div>
    <LanguageText
      :text="stage.questionText"
      :languages="languages"
      :largetext="true"
    >
      Quiz Question Text
    </LanguageText>

    <div class="form-group row">
      <label for="quizType" class="col-sm-1"><b>Quiz Type</b></label>
      <div class="col-sm-6">
        <div class="form-check">
          <label class="form-check-label">
            <!-- FIXME: Unexpected mutation of `stage` prop! -->
            <!-- eslint-disable -->
            <input
              type="radio"
              name="quizType"
              class="form-check-input"
              v-model="stage.quizType"
              value="multiple_choice"
            />
            <!-- eslint-enable -->
            Multiple Choice
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <!-- FIXME: Mutation of `stage` prop! -->
            <!-- eslint-disable -->
            <input
              type="radio"
              name="quizType"
              class="form-check-input"
              v-model="stage.quizType"
              value="free_text"
            />
            <!-- eslint-enable -->
            Free Text
          </label>
        </div>
      </div>
    </div>

    <div
      v-for="(response, index) in stage.responses"
      :key="index"
      class="form-group row responseOutline"
    >
      <div class="col-sm-12 mt-2">
        <LanguageText
          :text="response.text"
          :languages="languages"
          :largetext="isMultipleChoice"
        >
          Response
        </LanguageText>
        <span v-if="isMultipleChoice">
          <input v-model="response.correct" type="checkbox" value="1" /> Correct
        </span>
      </div>
    </div>

    <button class="btn btn-outline-primary" @click="addResponse">
      <i class="fas fa-plus"></i> Add response
    </button>

    <LanguageText
      :text="stage.hintText"
      :languages="languages"
      :largetext="true"
    >
      Hint
    </LanguageText>

    <div>
      <LanguageText
        :text="stage.buttonText"
        :languages="languages"
        :largetext="false"
      >
        Button Text
      </LanguageText>
    </div>
    <div v-if="!isMultipleChoice">
      <LanguageText
        :text="stage.answerPrompt"
        :languages="languages"
        :largetext="false"
      >
        Answer Prompt
      </LanguageText>
    </div>
    <div>
      <LanguageText
        :text="stage.hintPrompt"
        :languages="languages"
        :largetext="false"
      >
        Hint Prompt
      </LanguageText>
    </div>
    <div>
      <!-- FIXME: mutation of stage prop -->
      <!-- eslint-disable vue/no-mutating-props -->
      <input v-model="stage.requireCorrect" type="checkbox" value="1" />
      <!-- eslint-enable -->
      Require Correct Answer to Advance
    </div>
  </div>
</template>

<script>
import LanguageText from "./LanguageText.vue";

export default {
  components: {
    LanguageText,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour"],
  computed: {
    isMultipleChoice: function () {
      return this.stage.quizType == "multiple_choice";
    },
  },
  created() {
    if (!this.stage.questionText) {
      this.$set(this.stage, "questionText", { placeholder: null });
      this.$set(this.stage, "hintText", { placeholder: null });
      this.$set(this.stage, "quizType", "multiple_choice");
      this.$set(this.stage, "responses", []);
      this.$set(this.stage, "requireCorrect", 0);
      this.$set(this.stage, "buttonText", {
        placeholder: null,
        English: "Check my Answer",
      });
      this.$set(this.stage, "answerPrompt", {
        placeholder: null,
        English: "Answer",
      });
      this.$set(this.stage, "hintPrompt", {
        placeholder: null,
        English: "Show Hint",
      });
    }
  },
  methods: {
    addResponse: function () {
      // FIXME: Mutation of stage prop
      // eslint-disable-next-line
      this.stage.responses.push({ text: { placeholder: null }, correct: 0 });
    },
  },
};
</script>
<style scoped>
.responseOutline {
  border: 1px solid lightgray;
  border-radius: 3px;
}
</style>
