<template>
  <div class="card mt-2 tour-stop-stage">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title" data-cy="stage-title">
          <i class="fas fa-grip-vertical handle"></i> {{ stage.type }}
        </h5>
        <div class="controls">
          <button
            class="stage__remove-button"
            data-cy="remove-stage-button"
            @click="$emit('remove', stage)"
          >
            <i class="fas fa-times"></i>
            <span class="sr-only">Remove Stage</span>
          </button>
        </div>
      </div>
      <component
        :is="componentName"
        :stage="stage"
        :tourId="tourId"
        :stopId="stopId"
        @update="(updatedStage) => $emit('update', updatedStage)"
      >
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AR from "./stages/AR.vue";
import DeepDives from "./stages/DeepDives.vue";
import EmbedFrame from "./stages/Embed.vue";
import DeepDivesSummary from "./stages/DeepDiveSummary.vue";
import Feedback from "./stages/Feedback.vue";
import Guide from "./stages/Guide.vue";
import Gallery from "./stages/Gallery.vue";
import LanguageSelector from "./stages/LanguageSelector.vue";
import Navigation from "./stages/Navigation.vue";
import Separator from "./stages/Separator.vue";
import Quiz from "./stages/Quiz.vue";
import { Stage, StageType } from "@/types";

interface Props {
  stage: Stage;
  tourId: number;
  stopId: number;
}

const props = defineProps<Props>();

defineEmits<{
  (eventName: "remove", stage: Stage);
  (eventName: "update", stage: Stage);
}>();

const componentLookup = {
  [StageType.AR]: AR,
  [StageType.EmbedFrame]: EmbedFrame,
  [StageType.DeepDives]: DeepDives,
  [StageType.DeepDivesSummary]: DeepDivesSummary,
  [StageType.Feedback]: Feedback,
  [StageType.Gallery]: Gallery,
  [StageType.Guide]: Guide,
  [StageType.LanguageSelector]: LanguageSelector,
  [StageType.Navigation]: Navigation,
  [StageType.Separator]: Separator,
  [StageType.Quiz]: Quiz,
};

const componentName = computed(() => componentLookup[props.stage.type]);
</script>
<style scoped>
/*Make this global */
.card-title {
  margin-bottom: 0px;
  text-transform: capitalize;
}
.stage__remove-button {
  background: #f3f3f3;
  border: none;
  color: #777;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.stage__remove-button:hover {
  background: #333;
  color: #fff;
}
</style>
