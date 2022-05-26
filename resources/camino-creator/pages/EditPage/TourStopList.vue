<template>
  <section class="tour-stop-list my-4">
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

    <!-- <draggable v-model="tour.stops" :move="checkMove" handle=".handle"> -->
    <div
      v-for="stop in tourStore.getTour(tourId).stops"
      :key="stop.id"
      class="card mt-2"
    >
      <div class="card-body d-flex justify-content-between align-items-center">
        <h4 class="card-title">
          <i v-if="!isLockedItem(stop)" class="fas fa-grip-vertical handle"></i>
          <router-link
            :to="{
              name: 'editStop',
              params: { tourId, stopId: stop.id },
            }"
          >
            {{ stop.stop_content.title[locale] }}
          </router-link>
        </h4>
        <div class="controls d-flex gap-1">
          <button class="btn btn-outline-danger" @click="deleteStop(stop.id)">
            <i class="fas fa-trash"></i> Delete
          </button>

          <a
            :href="`/trekker/tours/${tourId}/stops/${stop.sort_order}`"
            class="btn btn-outline-success"
            target="_blank"
            ><i class="fas fa-eye"></i>
            <span class="d-none d-sm-inline">Preview</span>
          </a>
          <router-link
            :to="{
              name: 'editStop',
              params: { tourId, stopId: stop.id },
            }"
            class="btn btn-outline-primary"
            ><i class="fas fa-edit"></i>
            <span class="d-none d-sm-inline">Edit</span></router-link
          >
        </div>
      </div>
    </div>
    <!-- </draggable> -->
  </section>
</template>
<script setup>
import { ref } from "vue";
import { useTourStore } from "../../stores/tours";
import LanguageText from "../../components/LanguageText.vue";
import { createMultilingualText } from "../../components/Stage/stages/stageFactory";

const props = defineProps({
  tourId: {
    type: Number,
    required: true,
  },
  stops: {
    type: Array,
    required: true,
  },
  locale: {
    type: String,
    default: "English",
  },
});

const tourStore = useTourStore();
const showCreateForm = ref(false);
const languages = tourStore.getTourLanguages(props.tourId);

// localized titles
const newTitle = ref(createMultilingualText(languages));

function createNew() {
  tourStore.createTourStop(props.tourId, {
    stop_content: {
      title: newTitle.value,
    },
  });
  showCreateForm.value = false;
  newTitle.value = createMultilingualText(languages);
}

function isLockedItem(stop) {
  return (
    stop.sort_order === 0 ||
    stop.sort_order ===
      props.stops.map((s) => s.sort_order).reduce((a, b) => Math.max(a, b))
  );
}

function deleteStop(stopId) {
  if (confirm("Are you sure you wish to delete this stop?")) {
    tourStore.deleteTourStop(props.tourId, stopId);
  }
}
</script>
