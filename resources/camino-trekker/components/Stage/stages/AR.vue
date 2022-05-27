<template>
  <div class="ar-stage">
    <Button icon="travel_explore" @click="toggleShowAr">Look Around</Button>
    <Alert v-if="!isMobile" icon="info" variant="warning" :dismissable="false">
      Your device does <b>not</b> fully support Augmented Reality. Things could
      get weird. 🙃
    </Alert>

    <Teleport to="#modals">
      <div v-if="isShowingAR" class="ar-stage__modal">
        <iframe
          class="ar-iframe"
          :src="src"
          frameborder="0"
          width="100%"
          height="100%"
          :allow="`camera; geolocation; gyroscope; accelerometer; magnetometer; fullscreen`"
        >
          Loading AR...
        </iframe>
        <Button
          class="close-modal-button"
          icon="close"
          variant="icon-only"
          @click="isShowingAR = false"
          >Close</Button
        >
        <div class="optional-tools">
          <Toggle
            :checked="isSimulatingLocation"
            name="Simulate Location"
            @change="isSimulatingLocation = !isSimulatingLocation"
          >
            Simulate Location
          </Toggle>
        </div>

        <Alert
          v-if="!isMobile"
          class="ar-stage__modal-alert"
          icon="info"
          variant="warning"
          :dismissable="true"
        >
          Your device does <b>not</b> fully support Augmented Reality. Things
          could get weird. 🙃
        </Alert>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { object, string } from "vue-types";
import Button from "../../Button/Button.vue";
import { useStopIndex, useTour } from "../../../common/hooks";
import config from "../../../config";
import Toggle from "../../Toggle/Toggle.vue";
import Alert from "../../Alert/Alert.vue";

defineProps({
  stage: object().isRequired,
  locale: string().def("en"),
});

const isSimulatingLocation = ref(false);
const { tour } = useTour();
const { stopIndex } = useStopIndex();
const isShowingAR = ref(false);

function toggleShowAr() {
  isShowingAR.value = !isShowingAR.value;
}

const src = computed(() => {
  // TODO: change this to use 2 letter locales
  return `${config.appUrl}/ar/${tour.value.id}/${stopIndex.value}/English/${isSimulatingLocation.value}`;
});

const isMobile = computed(
  () =>
    "ontouchstart" in document.documentElement &&
    navigator.userAgent.match(/Mobi/)
);
</script>
<style scoped>
.ar-iframe {
  height: 100vh;
  margin: 0;
  background: var(--gray-lighter);
}

.ar-stage__modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* above navbar */
  z-index: 200;
}
.close-modal-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.optional-tools {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgb(255 255 255/ 0.5);
  -webkit-backdrop-filter: blur(1rem);
  backdrop-filter: blur(1rem);
  border-radius: 0.25rem;
}
.ar-stage__modal-alert {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 75vw;
  max-width: 40rem;
  margin: 0;
}
</style>
