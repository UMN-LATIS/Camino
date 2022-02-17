<template>
  <div>
    <div class="card" v-for="feedback in feedback" :key="feedback.id">
      <div class="card-body">
        <h4 class="card-title">{{ feedback.name }} {{ feedback.email }}</h4>
        <p class="card-text">{{ feedback.created_at }}</p>
        <p class="card-text">{{ feedback.feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tourId"],
  data() {
    return {
      feedback: null,
    };
  },
  methods: {},
  mounted() {
    axios.get("/creator/" + this.tourId + "/feedback").then((res) => {
      this.feedback = res.data;
    });
  },
};
</script>
