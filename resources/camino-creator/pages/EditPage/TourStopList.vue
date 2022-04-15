<template>
  <section class="tour-stop-list my-4">
    <header class="d-flex justify-content-between">
      <h3>Tour Stops</h3>
      <router-link
        :to="{ name: 'createStop', params: { tourId } }"
        class="btn btn-primary"
      >
        <i class="fas fa-plus" /> Add a Stop
      </router-link>
    </header>

    <!-- <draggable v-model="tour.stops" :move="checkMove" handle=".handle"> -->
    <div
      v-for="stop in tourStore.getTourStops(tourId)"
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
            :href="`/tour/${tourId}/stop.sort_order`"
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
// import { computed } from 'vue';
import { useTourStore } from "../../stores/tours";

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
console.log(tourStore.getTourStops(props.tourId));

function isLockedItem(stop) {
  return (
    stop.sort_order === 0 ||
    stop.sort_order ===
      props.stops.map((s) => s.sort_order).reduce((a, b) => Math.max(a, b))
  );
}

function deleteStop(stopId) {
  if (confirm("Are you sure you wish to delete this stop?")) {
    tourStore.deleteTourStop({ tourId: props.tourId, stopId });
  }
}
</script>
