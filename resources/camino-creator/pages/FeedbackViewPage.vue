<template>
  <div>
    <h1>Feedback</h1>
    <p v-if="!feedback.length">No feedback yet.</p>
    <div
      v-for="feedbackResponse in feedback"
      :key="feedbackResponse.id"
      class="card"
    >
      <div class="card-body">
        <h4 class="card-title">
          {{ feedbackResponse.name }} {{ feedbackResponse.email }}
        </h4>
        <p class="card-text">{{ feedbackResponse.created_at }}</p>
        <p class="card-text">{{ feedbackResponse.feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { axiosClient as axios } from "@creator/common/axios";
import type { FeedbackResponse } from "@/types";

interface Props {
  tourId: number;
}

const props = defineProps<Props>();

const feedback = ref<FeedbackResponse[]>([]);

onMounted(() => {
  axios.get(`/creator/${props.tourId}/feedback`).then((res) => {
    feedback.value = res.data;
  });
});
</script>
