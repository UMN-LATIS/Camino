<template>
  <div class="navigation-stage">
    <Markdown :content="markdown" />
    <Button v-if="hasShowMapToggle" icon="map" @click="toggleShowMap">
      Show Map
    </Button>
    <div v-if="showMap" class="navigation-stage__tour-map-wrapper">
      <TourMap
        v-if="stage.targetPoint"
        :initialMapStyle="MapboxMapStyle.streets"
        type="stop"
        :stopIndex="store.stopIndex"
      />
      <div v-else class="tour-map-error">
        <p>No target point set for navigation stage.</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import Markdown from "../../Markdown/Markdown.vue";
import Button from "../../Button/Button.vue";
import TourMap from "../../TourMap/TourMap.vue";
import { NavigationStage, MapboxMapStyle } from "@/types";
import { useTrekkerStore } from "@trekker/stores/useTrekkerStore";

interface Props {
  stage: NavigationStage;
  hasShowMapToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasShowMapToggle: true,
});
const store = useTrekkerStore();
const markdown = computed(() => props.stage.text[store.locale] ?? "");
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
.tour-map-error {
  background: #ddd;
  font-size: 2rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
