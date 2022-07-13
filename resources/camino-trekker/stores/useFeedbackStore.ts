import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "@/shared/axios";
import config from "@/camino-trekker/config";
import { useStorage } from "@vueuse/core";
import { useTrekkerStore } from "./useTrekkerStore";

export const useFeedbackStore = defineStore("feedback", {
  state: () => {
    const { tourId } = useTrekkerStore();
    const storageKey = `camino.trekker.tour-${tourId}.feedbackStore`;
    return {
      name: useStorage<string>(`${storageKey}.name`, ""),
      email: useStorage<string>(`${storageKey}.email`, ""),
      feedback: useStorage<string>(`${storageKey}.feedback`, ""),
      isSubmitting: false,
      isNewSubmission: true,
      error: "",
    };
  },
  actions: {
    softReset() {
      /** keep name and email  */
      this.feedback = "";
      this.isNewSubmission = true;
    },
    submitFeedbackForTour(tourId: number) {
      this.isSubmitting = true;
      axios
        .post(`${config.appUrl}/feedback/${tourId}`, {
          name: this.name,
          email: this.email,
          feedback: this.feedback,
        })
        .then(() => {
          this.isSubmitting = false;
          this.isNewSubmission = false;
        })
        .catch((err) => {
          this.isSubmitting = false;
          this.error = `There was a problem submitting your feedback: ${err.message}. Try again and if the problem persists, please email latistecharch@umn.edu.`;
        });
    },
  },
});

// see: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    acceptHMRUpdate(useFeedbackStore, import.meta.webpackHot)
  );
}
