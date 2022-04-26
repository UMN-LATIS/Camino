<template>
  <div class="card mt-2">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title">
          <i class="fas fa-grip-vertical handle"></i> {{ stage.type }}
        </h5>
        <div class="controls">
          <button
            class="btn btn-outline-danger"
            @click="$emit('remove', stage)"
          >
            <i class="fas fa-trash"></i> Remove Stage
          </button>
        </div>
      </div>
      <component
        :is="componentName"
        :stage="stage"
        :languages="tour.tour_content.languages"
        :tour="tour"
        :stop="stop"
        :tourId="tourId"
        :stopId="stopId"
        @update="(updatedStage) => $emit('update', updatedStage)"
      >
      </component>
    </div>
  </div>
</template>

<script setup>
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
import { STAGE_TYPES } from "../../common/constants";

const props = defineProps({
  stage: {
    type: Object,
    required: true,
  },
  tour: {
    type: Object,
    required: true,
  },
  stop: {
    type: Object,
    required: true,
  },
  tourId: {
    type: Number,
    required: true,
  },
  stopId: {
    type: Number,
    required: true,
  },
});

defineEmits(["remove", "update"]);

const componentLookup = {
  [STAGE_TYPES.AR]: AR,
  [STAGE_TYPES.EMBED_FRAME]: EmbedFrame,
  [STAGE_TYPES.DEEPDIVES]: DeepDives,
  [STAGE_TYPES.DEEPDIVES_SUMMARY]: DeepDivesSummary,
  [STAGE_TYPES.FEEDBACK]: Feedback,
  [STAGE_TYPES.GALLERY]: Gallery,
  [STAGE_TYPES.GUIDE]: Guide,
  [STAGE_TYPES.LANGUAGE_SELECTOR]: LanguageSelector,
  [STAGE_TYPES.NAVIGATION]: Navigation,
  [STAGE_TYPES.SEPARATOR]: Separator,
};

const componentName = computed(() => componentLookup[props.stage.type]);
</script>
<style scoped>
/*Make this global */
.card-title {
  margin-bottom: 0px;
  text-transform: capitalize;
}
</style>
