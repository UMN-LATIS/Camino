<template>
  <div v-if="store.tour" class="tour-stop">
    <StopHeader
      class="tour-stop__header"
      :title="title"
      :subtitle="subtitle"
      :stopNumber="store.stopIndex + 1"
      :headerImage="headerImage"
    >
      <!-- <TourAuthor v-if="isFirstStop && tour.author" :author="tour.author" /> -->
    </StopHeader>
    <div class="tour-stop__stages container">
      <div class="tour-stop__contents">
        <h2 v-if="store.isFirstStop">Start</h2>
        <section
          v-for="stage in stages"
          :key="`${store.currentStop.id}-${stage.id}`"
        >
          <Stage :stage="stage" />
        </section>
        <Button
          v-if="!store.isLastStop"
          icon="arrow_forward"
          iconPosition="after"
          variant="primary"
          @click="handleNextStopClick"
        >
          Continue
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Button from "../Button/Button.vue";
import StopHeader from "../StopHeader/StopHeader.vue";
// import TourAuthor from "../TourAuthor/TourAuthor.vue";
import Stage from "../Stage/Stage.vue";
import { computed } from "vue";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { Maybe, Image } from "@/types";
import { useQuizStore } from "@/camino-trekker/stores/useQuizStore";
import { useRouter } from "vue-router";

const store = useTrekkerStore();
const router = useRouter();
const quizStore = useQuizStore();

const stages = computed(() => store.currentStop.stop_content.stages) || [];

const headerImage = computed(
  (): Maybe<Image> => store.currentStop.stop_content.header_image || null
);

const title = computed((): string => {
  if (!store.tour) return "";
  return store.isFirstStop
    ? store.tour.title
    : store.currentStop.stop_content.title?.[store.locale] ?? "";
});

const subtitle = computed(
  (): string => store.currentStop.stop_content.subtitle?.[store.locale] ?? ""
);

/** checks that all quizzes are completed */
function canProceedToNextStop(): boolean {
  return quizStore.currentStopQuizzes.every(
    (quiz) => quiz.status === "complete"
  );
}

function goToNextStop() {
  return router.push(`/tours/${store.tourId}/stops/${store.stopIndex + 1}`);
}

function launchQuiz() {
  // mark all inactive quiz questions at this stop as active
  quizStore.currentStopQuizzes.forEach((quiz) => {
    if (quiz.status === "complete") return;
    quizStore.setQuizStatus(quiz.id, "active");
  });
}

function handleNextStopClick() {
  canProceedToNextStop() ? goToNextStop() : launchQuiz();
}
</script>
<style scoped>
.tour-stop {
  position: relative;
}
.tour-stop__stages {
  background: var(--white);
  border-radius: 1rem 1rem 0 0;
  padding-bottom: 10rem;
  box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1);
}
.tour-stop__header {
  z-index: -1;
}
.tour-stop__contents {
  position: relative;
  max-width: 50rem;
  margin: 0 auto;
}
</style>
