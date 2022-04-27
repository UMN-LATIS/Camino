<template>
  <div>
    <p>{{ stage.questionText[$i18n.locale] }}</p>

    <div v-if="stage.quizType == 'multiple_choice'">
      <div
        v-for="(response, index) in stage.responses"
        :key="index"
        class="form-check"
      >
        <label class="form-check-label">
          <input
            v-model="selectedAnswer"
            type="radio"
            class="form-check-input"
            :value="response"
          />
          {{ response.text[$i18n.locale] }}
        </label>
      </div>
    </div>
    <div v-else>
      <div class="form-group">
        <label for="">{{ stage.answerPrompt[$i18n.locale] }}</label>
        <input
          v-model="selectedAnswer"
          type="text"
          class="form-control"
          name="quiz_answer"
        />
      </div>
    </div>

    <p v-if="showHint">
      {{ stage.hintText[$i18n.locale] }}
    </p>
    <button class="btn btn-outline-primary" @click="showHint = true">
      {{ stage.hintPrompt[$i18n.locale] }}
    </button>
    <button class="btn btn-outline-primary" @click="checkMyAnswer">
      {{ stage.buttonText[$i18n.locale] }}
    </button>
    <SaveAlert v-model:showAlert="showAlert"
      ><i v-if="correct" class="far fa-check-circle answer align-middle"></i>
      <i v-if="!correct" class="far fa-times-circle answer align-middle"></i>
    </SaveAlert>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "tour", "currentStopId"],
  data() {
    return {
      selectedAnswer: "",
      showAlert: false,
      correct: false,
      showHint: false,
    };
  },
  computed: {},
  mounted() {
    if (this.stage.requireCorrect) {
      if (
        !this.$store.state.locks[this.currentStopId] ||
        !this.$store.state.locks[this.currentStopId].find(
          (e) => e.text == this.stage.questionText[this.$i18n.locale]
        )
      ) {
        this.$store.commit("lockStop", {
          stop: this.currentStopId,
          text: this.stage.questionText[this.$i18n.locale],
        });
      }
    }
  },
  methods: {
    checkMyAnswer: function () {
      if (this.stage.quizType == "multiple_choice") {
        if (this.selectedAnswer.correct == true) {
          this.correct = true;
        } else {
          this.correct = false;
        }
      } else if (this.stage.quizType == "free_text") {
        if (
          this.stage.responses.filter(
            (r) =>
              r.text[this.$i18n.locale].toLowerCase().trim() ==
              this.selectedAnswer.toLowerCase().trim()
          ).length > 0
        ) {
          this.correct = true;
        } else {
          this.correct = false;
        }
      }

      if (this.correct) {
        this.showAlert = true;
        this.$store.commit("unlockStop", {
          stop: this.currentStopId,
          text: this.stage.questionText[this.$i18n.locale],
        });
      } else {
        this.showAlert = true;
      }
    },
  },
};
</script>

<style scoped>
.answer {
  font-size: 1.6em;
}
.answer.fa-check-circle {
  color: green;
}
.answer.fa-times-circle {
  color: red;
}
</style>
