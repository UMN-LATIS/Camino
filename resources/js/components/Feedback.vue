<template>
  <div>
    <div v-html="formattedText"></div>

    <b-button v-b-toggle.collapse-feedback variant="primary">{{
      $t("stage.feedback.button")
    }}</b-button>
    <b-collapse id="collapse-feedback" class="mt-2">
      <div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="">Your Name</label>
          <input
            type="text"
            class="form-control"
            name=""
            v-model="name"
            id=""
            aria-describedby="helpId"
            placeholder=""
          />
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="">Your E-mail</label>
          <input
            type="email"
            class="form-control"
            name=""
            v-model="email"
            id=""
            aria-describedby="emailHelpId"
            placeholder=""
          />
        </div>
        <div class="form-group col-md-6 col-sm-12">
          <label for="">Feedback</label>
          <textarea
            class="form-control"
            name=""
            id=""
            v-model="feedback"
            rows="3"
          ></textarea>
        </div>
        <div class="form-group col-12">
          <button type="submit" class="btn btn-primary" @click="submitFeedback">
            Submit Feedback
          </button>
          <i class="fas fa-check-circle ml-2" v-if="success"></i>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<style scoped>
.fa-check-circle {
  color: green;
  font-size: 1.4em;
}
</style>

<script>
export default {
  props: ["stage", "tour"],
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
        .then((res) => {
          this.success = true;
        });
    },
  },
};
</script>
