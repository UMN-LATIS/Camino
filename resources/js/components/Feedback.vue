<template>
  <div>
    <div v-html="formattedText"></div>

    <b-button v-b-toggle.collapse-feedback variant="primary">{{
      t("stage.feedback.button")
    }}</b-button>
    <b-collapse id="collapse-feedback" class="mt-2">
      <div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="">Your Name</label>
          <input
            id=""
            v-model="name"
            type="text"
            class="form-control"
            name=""
            aria-describedby="helpId"
            placeholder=""
          />
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="">Your E-mail</label>
          <input
            id=""
            v-model="email"
            type="email"
            class="form-control"
            name=""
            aria-describedby="emailHelpId"
            placeholder=""
          />
        </div>
        <div class="form-group col-md-6 col-sm-12">
          <label for="">Feedback</label>
          <textarea
            id=""
            v-model="feedback"
            class="form-control"
            name=""
            rows="3"
          ></textarea>
        </div>
        <div class="form-group col-12">
          <button type="submit" class="btn btn-primary" @click="submitFeedback">
            Submit Feedback
          </button>
          <i v-if="success" class="fas fa-check-circle ml-2"></i>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  props: ["stage", "tour"],
  setup() {
    const { t } = useI18n(); // use as global scope
    return { t };
  },
  data() {
    return {
      email: null,
      name: null,
      feedback: null,
      success: false,
    };
  },
  computed: {
    formattedText: function () {
      return this.marked(this.purify(this.stage.text[this.$i18n.locale]));
    },
  },
  methods: {
    submitFeedback: function () {
      axios
        .post("/feedback/" + this.tour.id, {
          name: this.name,
          email: this.email,
          feedback: this.feedback,
        })
        .then(() => {
          this.success = true;
        });
    },
  },
};
</script>

<style scoped>
.fa-check-circle {
  color: green;
  font-size: 1.4em;
}
</style>
