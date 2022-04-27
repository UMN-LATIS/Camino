<template>
  <div class="navigation-stage">
    <Markdown :content="markdown" />
    <Button v-if="hasShowMapToggle" icon="map" @click="toggleShowMap">
      Show Map
    </Button>
    <div v-if="showMap" class="navigation-stage__tour-map-wrapper">
      <TourMap initialMapStyle="streets" type="stop" :stopIndex="stopIndex" />
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { bool, shape, string } from "vue-types";
import { useStopIndex } from "../../../common/hooks";
import Markdown from "../../Markdown/Markdown.vue";
import Button from "../../Button/Button.vue";
import TourMap from "../../TourMap/TourMap.vue";

const props = defineProps({
  stage: shape({
    // I18n object like: { en: 'hello', es: 'hola'}
    text: Object,
  }).loose,
  locale: string().isRequired,
  hasShowMapToggle: bool().def(true),
});

const markdown = computed(() => props.stage.text[props.locale]);
const { stopIndex } = useStopIndex();

// if no toggle, show map by default
// if toggle, hide map
const showMap = ref(!props.hasShowMapToggle);

const toggleShowMap = () => (showMap.value = !showMap.value);
</script>
<style>
.navigation-stage {
  margin: 2rem 0;
}
.navigation-stage__tour-map-wrapper {
  height: 50vh;
}
</style>
