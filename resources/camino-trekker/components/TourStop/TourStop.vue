<template>
  <div v-if="trekkerStore.tour" class="tour-stop">
    <StopHeader
      class="tour-stop__header"
      :title="title"
      :subtitle="subtitle"
      :stopNumber="trekkerStore.stopIndex + 1"
      :headerImage="headerImage"
    >
      <!-- <TourAuthor v-if="isFirstStop && tour.author" :author="tour.author" /> -->
    </StopHeader>
    <div class="tour-stop__stages container">
      <div class="tour-stop__contents">
        <h2 v-if="trekkerStore.isFirstStop">Start</h2>
        <section
          v-for="stage in stages"
          :key="`${trekkerStore.currentStop.id}-${stage.id}`"
        >
          <Stage :stage="stage" />
        </section>
        <Button
          v-if="!trekkerStore.isLastStop"
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

const trekkerStore = useTrekkerStore();
const router = useRouter();
const quizStore = useQuizStore();

const stages =
  computed(() => trekkerStore.currentStop.stop_content.stages) || [];

const headerImage = computed(
  (): Maybe<Image> => trekkerStore.currentStop.stop_content.header_image || null
);

const title = computed((): string => {
  if (!trekkerStore.tour) return "";
  return trekkerStore.isFirstStop
    ? trekkerStore.tour.title
    : trekkerStore.currentStop.stop_content.title?.[trekkerStore.locale] ?? "";
});

const subtitle = computed(
  (): string =>
    trekkerStore.currentStop.stop_content.subtitle?.[trekkerStore.locale] ?? ""
);

function goToNextStop() {
  return router.push(
    `/tours/${trekkerStore.tourId}/stops/${trekkerStore.stopIndex + 1}`
  );
}

const isNextStopLocked = computed(
  () => !quizStore.allCurrentStopQuizzesComplete
);

function handleNextStopClick() {
  isNextStopLocked.value ? quizStore.openQuizModal() : goToNextStop();
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
