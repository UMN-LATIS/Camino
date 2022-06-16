<template>
  <section class="tour-stop-list my-4" data-cy="tour-stop-list">
    <header>
      <h3 class="mb-3">Tour Stops</h3>

      <button
        class="btn btn-outline-primary mb-3"
        @click="showCreateForm = !showCreateForm"
      >
        <i class="fas fa-plus"></i> New Stop
      </button>

      <form
        v-if="showCreateForm"
        class="p-2 bg-body bg-gradient shadow-sm p-3 mb-3 rounded"
        @submit.prevent="createNew"
      >
        <LanguageText
          class="mb-3"
          :languages="languages"
          :text="newTitle"
          @update:text="(text) => (newTitle = text)"
        >
          Stop Name
        </LanguageText>
        <button class="btn btn-primary">Create</button>
      </form>
    </header>

    <div class="stop-list">
      <TourStopCard
        :tourId="tourId"
        :stop="firstStop"
        :showMoveHandle="false"
        :showDelete="false"
      />
      <Draggable
        :modelValue="moveableStops"
        itemKey="id"
        class="stop-list__movable-stops"
        handle=".handle"
        ghostClass="ghost"
        @change="handleTourStopMove"
      >
        <template #item="{ element }">
          <TourStopCard
            :tourId="tourId"
            :stop="element"
            :showMoveHandle="true"
            :showDelete="true"
          />
        </template>
      </Draggable>
      <TourStopCard
        :tourId="tourId"
        :stop="lastStop"
        :showMoveHandle="false"
        :showDelete="false"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import LanguageText from "../../components/LanguageText.vue";
import { createEmptyLocalizedText } from "@/shared/i18n";
import TourStopCard from "./TourStopCard.vue";
import { Locale, type TourStop } from "@/types";
import Draggable from "vuedraggable";

interface Props {
  tourId: number;
  stops: TourStop[];
  locale: Locale;
}

const props = withDefaults(defineProps<Props>(), {
  locale: Locale.en,
});

const creatorStore = useCreatorStore();
const showCreateForm = ref(false);
const languages = creatorStore.getTourLanguages(props.tourId);

// localized titles
const newTitle = ref(createEmptyLocalizedText(languages));

function createNew() {
  creatorStore.createTourStop(props.tourId, {
    stop_content: {
      title: newTitle.value,
    },
  });
  showCreateForm.value = false;
  newTitle.value = createEmptyLocalizedText(languages);
}

const tourStops = computed<TourStop[]>(
  () => creatorStore.getTour(props.tourId).stops
);

const firstStop = computed<TourStop>(() => tourStops.value[0]);
const lastStop = computed<TourStop>(
  () => tourStops.value[tourStops.value.length - 1]
);
const moveableStops = computed<TourStop[]>(() =>
  tourStops.value.filter(
    (s) => s.id !== firstStop.value.id && s.id !== lastStop.value.id
  )
);

const draggableKey = ref(0);
function handleTourStopMove(event) {
  if (!event.moved) return;
  const { oldIndex, newIndex } = event.moved;

  // old and new indices are from the movable stops
  // array and don't account for the the static first
  // stop. So, we need to shift the indices by 1;
  creatorStore.moveTourStopByIndex(props.tourId, oldIndex + 1, newIndex + 1);

  // force rerender
  nextTick(() => (draggableKey.value += 1));
}
</script>
