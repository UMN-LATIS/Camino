<template>
  <div class="card mt-2">
    <div class="card-body d-flex justify-content-between align-items-center">
      <h4 class="card-title">
        <i v-if="showMoveHandle" class="fas fa-grip-vertical handle"></i>
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
        <button
          v-if="showDelete"
          class="btn btn-outline-danger"
          @click="handleDeleteStopClick"
        >
          <i class="fas fa-trash"></i> Delete
        </button>

        <a
          :href="`/trekker/tours/${tourId}/stops/${stop.sort_order}`"
          class="btn btn-outline-success"
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
</template>
<script setup lang="ts">
import type { TourStop } from "@/types";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { RouterLink } from "vue-router";

interface Props {
  tourId: number;
  stop: TourStop;
  showMoveHandle?: boolean;
  showDelete?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showMoveHandle: true,
  showDelete: true,
});

const creatorStore = useCreatorStore();
const locale = creatorStore.getDefaultTourLanguage(props.tourId);

function handleDeleteStopClick() {
  if (confirm("Are you sure you wish to delete this stop?")) {
    creatorStore.deleteTourStop(props.tourId, props.stop.id);
  }
}
</script>
