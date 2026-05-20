<template>
  <div v-if="tour" class="routes-debug">
    <header class="routes-debug__header mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <small class="text-muted">Debug</small>
          <h2 class="mb-0">{{ tour.title }} — Routes</h2>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="reloadFromServer">
            <i class="fas fa-sync"></i> Reload from server
          </button>
          <router-link
            :to="{ name: 'editTour', params: { tourId } }"
            class="btn btn-outline-secondary"
          >
            <i class="fas fa-arrow-left"></i> Back to tour
          </router-link>
        </div>
      </div>
    </header>

    <section class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          <i class="fas fa-star text-warning"></i> Tour start_location
        </h5>
        <pre class="mb-0 small">{{ formatLngLat(tour.start_location) }}</pre>
      </div>
    </section>

    <p v-if="!editableStops.length" class="text-muted">
      This tour has no stops with Navigation stages.
    </p>

    <ol class="list-unstyled p-0 m-0" data-cy="tour-routes-debug-stop-list">
      <li
        v-for="(entry, index) in editableStops"
        :key="entry.stop.id"
        class="mb-4"
      >
        <StopRouteCard
          :tourId="tour.id"
          :stop="entry.stop"
          :navStage="entry.navStage"
          :index="index"
          @update:route="(route) => handleRouteUpdate(entry, route)"
          @update:targetPoint="(point) => handleTargetUpdate(entry, point)"
        />
      </li>
    </ol>
  </div>
  <p v-else class="text-muted">Loading tour…</p>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import {
  type Tour,
  type TourStop,
  type NavigationStage,
  type LngLat,
  type Maybe,
  StageType,
} from "@/types";
import StopRouteCard from "./StopRouteCard.vue";

interface Props {
  tourId: number;
}
const props = defineProps<Props>();

const creatorStore = useCreatorStore();

const tour = computed<Maybe<Tour>>(() => {
  try {
    return creatorStore.getTour(props.tourId).value;
  } catch {
    return null;
  }
});

interface EditableStopEntry {
  stop: TourStop;
  navStage: NavigationStage;
}

const editableStops = computed<EditableStopEntry[]>(() => {
  if (!tour.value) return [];

  return tour.value.stops
    .map((stop) => {
      const navStage = firstNavStage(stop);
      if (!navStage) return null;
      return { stop, navStage };
    })
    .filter((entry): entry is EditableStopEntry => entry !== null);
});

function firstNavStage(stop: TourStop): Maybe<NavigationStage> {
  return (
    (stop.stop_content.stages.find(
      (s) => s.type === StageType.Navigation,
    ) as Maybe<NavigationStage>) ?? null
  );
}

function formatLngLat(point: Maybe<LngLat>): string {
  if (!point) return "null";
  return JSON.stringify(point, null, 2);
}

function handleRouteUpdate(entry: EditableStopEntry, route: LngLat[]): void {
  const updatedStage: NavigationStage = { ...entry.navStage, route };
  creatorStore.updateTourStopStage(props.tourId, entry.stop.id, updatedStage);
}

function handleTargetUpdate(
  entry: EditableStopEntry,
  targetPoint: LngLat,
): void {
  const updatedStage: NavigationStage = { ...entry.navStage, targetPoint };
  creatorStore.updateTourStopStage(props.tourId, entry.stop.id, updatedStage);
}

async function reloadFromServer(): Promise<void> {
  await creatorStore.fetchTours();
}

onMounted(async () => {
  if (!creatorStore.isReady) {
    await creatorStore.init();
  }

  // Cypress seam: drive mutations directly instead of synthesizing canvas drags.
  (
    window as unknown as { __creatorStore?: typeof creatorStore }
  ).__creatorStore = creatorStore;
});

onBeforeUnmount(() => {
  delete (window as unknown as { __creatorStore?: typeof creatorStore })
    .__creatorStore;
});
</script>

<style scoped>
.routes-debug {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
