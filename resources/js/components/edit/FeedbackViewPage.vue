<template>
  <div>
    <h1>Feedback</h1>
    <p v-if="!feedback.lenght">No feedback yet.</p>
    <div
      v-for="feedbackResponse in feedback"
      :key="feedbackResponse.id"
      class="card"
    >
      <div class="card-body">
        <h4 class="card-title">
          {{ feedbackResponse.name }} {{ feedback.email }}
        </h4>
        <p class="card-text">{{ feedbackResponse.created_at }}</p>
        <p class="card-text">{{ feedbackResponse.feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tourId"],
  data() {
    return {
      feedback: [],
    };
  },
  mounted() {
    axios.get("/creator/" + this.tourId + "/feedback").then((res) => {
      this.feedback = res.data;
    });
  },
  methods: {},
};
</script>
