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
      <h3 class="fs-6">Target Point and Route</h3>

      <div
        v-if="stage.targetPoint"
        class="d-inline-flex gap-4 my-2 bg-light p-2"
      >
        <div>
          <small class="d-block">Latitude</small>
          <span>{{ stage.targetPoint.lat.toFixed(4) }}</span>
        </div>
        <div>
          <small class="d-block">Longitude</small>
          <span>{{ stage.targetPoint.lng.toFixed(4) }}</span>
        </div>
      </div>
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
import { NavigationStage } from "@/types";
import NavStageRouteMapper from "../../NavStageRouteMapper.vue";

interface Props {
  tourId: number;
  stopId: number;
  stage: NavigationStage;
}

const props = defineProps<Props>();

const creatorStore = useCreatorStore();
const tourLanguages = creatorStore.getTourLanguages(props.tourId);

const emit = defineEmits(["update"]);
function handleUpdateTargetPoint(targetPoint) {
  emit("update", {
    ...props.stage,
    targetPoint,
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
