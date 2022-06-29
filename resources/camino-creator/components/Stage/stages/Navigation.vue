<template>
  <div>
    <LanguageText
      :text="stage.text"
      :languages="tourLanguages"
      :largetext="true"
      @update:text="handleUpdateText"
    >
      Navigation Text
    </LanguageText>

    <section class="my-3">
      <NavStageRouteMapper
        :tourId="tourId"
        :stopId="stopId"
        :route="stage.route"
        :targetPoint="stage.targetPoint"
        @update:targetPoint="handleUpdateTargetPoint"
        @update:route="handleUpdateRoute"
      />
    </section>
  </div>
</template>
<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { NavigationStage, LngLat } from "@/types";
import NavStageRouteMapper from "../../NavStageRouteMapper.vue";

const props = defineProps<{
  tourId: number;
  stopId: number;
  stage: NavigationStage;
}>();

const emit = defineEmits<{
  (eventName: "update", stage: NavigationStage);
}>();

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);

function handleUpdateTargetPoint(newTargetPoint: LngLat) {
  emit("update", {
    ...props.stage,
    targetPoint: newTargetPoint,
  });
}

function handleUpdateRoute(route) {
  emit("update", {
    ...props.stage,
    route,
  });
}

function handleUpdateText(text) {
  emit("update", {
    ...props.stage,
    text,
  });
}
</script>
<style>
.css-icon {
  border-radius: 30px;
  height: 10px;
  width: 10px;
  z-index: 10;
}

.target-css-icon {
  border: 3px solid red;
  background-color: red;
}
</style>
