<template>
  <div class="tour-stop">
    <StopHeader
      class="tour-stop__header"
      :title="isFirstStop ? tour.title : stop.stop_content.title[locale]"
      :subtitle="tour.subtitle || ''"
      :stopNumber="stopIndex + 1"
      :imageSrc="headerImageSrc"
      :imageAlt="headerImageAlt"
    >
      <TourAuthor v-if="isFirstStop && tour.author" :author="tour.author" />
    </StopHeader>
    <div class="tour-stop__stages container">
      <div class="tour-stop__contents">
        <h2 v-if="isFirstStop">Start</h2>
        <section v-for="stage in stages" :key="`${stop.id}-${stage.id}`">
          <Stage :stage="stage" :locale="locale" />
        </section>
        <Button
          v-if="!isLastStop"
          icon="arrow_forward"
          iconPosition="end"
          variant="primary"
          @click="$router.push(`/tours/${tour.id}/stops/${stopIndex + 1}`)"
        >
          Continue
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import Button from "../Button/Button.vue";
import StopHeader from "../StopHeader/StopHeader.vue";
import TourAuthor from "../TourAuthor/TourAuthor.vue";
import Stage from "../Stage/Stage.vue";
import { computed } from "vue";
import { useTour, useLocale } from "../../common/hooks";
import { number } from "vue-types";
import config from "../../config";

const props = defineProps({
  stopIndex: number().def(0),
});

const { tour } = useTour();
const { locale } = useLocale();
const stop = computed(() => tour.value?.stops[props.stopIndex]);
const isFirstStop = computed(() => props.stopIndex === 0);
const isLastStop = computed(
  () => props.stopIndex === tour.value.stops.length - 1
);
const stages = computed(() => stop.value?.stop_content?.stages) || [];
const headerImageSrc = computed(() => {
  const image = stop.value?.stop_content?.header_image;
  if (!image) return null;
  return `${config.appUrl}${image.src}`;
});

const headerImageAlt = computed(() => {
  const image = stop.value?.stop_content?.header_image;
  if (!image) return null;
  return image.alt;
});
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
