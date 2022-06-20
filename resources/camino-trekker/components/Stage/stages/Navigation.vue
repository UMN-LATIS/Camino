<template>
  <div class="navigation-stage">
    <Markdown :content="markdown" />
    <Button v-if="hasShowMapToggle" icon="map" @click="toggleShowMap">
      Show Map
    </Button>
    <div v-if="showMap" class="navigation-stage__tour-map-wrapper">
      <TourMap
        initialMapStyle="streets"
        type="stop"
        :stopIndex="store.stopIndex"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import Markdown from "../../Markdown/Markdown.vue";
import Button from "../../Button/Button.vue";
import TourMap from "../../TourMap/TourMap.vue";
import { NavigationStage } from "@/types";
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
