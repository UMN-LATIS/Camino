<template>
  <div class="feedback-stage">
    <h3>Feedback</h3>
    <form
      v-if="feedbackStore.isNewSubmission && !feedbackStore.isSubmitting"
      class="feedback-stage__form"
      @submit.prevent="feedbackStore.submitFeedbackForTour(trekkerStore.tourId)"
    >
      <Input v-model="feedbackStore.name" label="Name" type="text" required />
      <Input
        v-model="feedbackStore.email"
        label="Email"
        type="email"
        required
      />
      <TextArea
        v-model="feedbackStore.feedback"
        label="Comment"
        required
      ></TextArea>
      <Error v-if="feedbackStore.error"> {{ feedbackStore.error }} </Error>
      <div class="feedback-stage__actions">
        <Button variant="link" type="reset">Cancel</Button>
        <Button
          type="submit"
          iconPosition="after"
          :disabled="!feedbackStore.canSubmit"
          >Submit</Button
        >
      </div>
    </form>
    <Spinner v-if="feedbackStore.isSubmitting" />
    <div v-if="!feedbackStore.isNewSubmission" class="feedback-stage__success">
      <p>Thank you for your feedback.</p>
      <Button @click="feedbackStore.softReset()">Share More</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Input from "../../Input/Input.vue";
import TextArea from "../../TextArea/TextArea.vue";
import Button from "../../Button/Button.vue";
import Error from "../../Error/Error.vue";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import Spinner from "@/camino-creator/components/Spinner.vue";
import { useFeedbackStore } from "@/camino-trekker/stores/useFeedbackStore";

const trekkerStore = useTrekkerStore();
const feedbackStore = useFeedbackStore();
</script>
<style scoped>
.feedback-stage {
  max-width: 30rem;
}

.feedback-stage__actions {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  gap: 0.5rem;
}
</style>
