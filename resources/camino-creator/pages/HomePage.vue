<template>
  <div>
    <Error :error="error" />
    <div>
      <h1 class="mb-3">My Tours</h1>
      <button
        class="btn btn-outline-primary mb-3"
        @click="showCreateForm = !showCreateForm"
      >
        <i class="fas fa-plus"></i> New Tour
      </button>

      <form
        v-if="showCreateForm"
        class="w-50 p-2 bg-body bg-gradient shadow-sm p-3 mb-5 rounded"
        @submit.prevent="createNew"
      >
        <div class="mb-3">
          <label for="new-title" class="form-label">Tour Name</label>
          <input
            id="new-title"
            v-model="newTitle"
            type="text"
            class="form-control"
            placeholder="Stone Arch Bridge"
          />
        </div>
        <button class="btn btn-primary">Create</button>
      </form>
    </div>

    <div v-for="tour in toursSortedByTitle" :key="tour.id" class="card mt-2">
      <div
        class="card-body d-flex justify-content-between align-items-center flex-wrap"
      >
        <h5 class="card-title">
          <i v-if="tour.active" class="fas fa-check-circle mr-2"></i
          ><i v-if="tour.public" class="fas fa-globe mr-2"></i>
          <span>
            <i v-if="tour.walking == 1" class="fas fa-walking"></i>
            <i v-if="tour.biking == 1" class="fas fa-biking"></i>
            <i v-if="tour.driving == 1" class="fas fa-car"></i>
          </span>
          {{ tour.title }}
        </h5>
        <div class="controls pt-2 pt-sm-0">
          <router-link
            :to="{ name: 'tourFeedback', params: { tourId: tour.id } }"
            class="btn btn-outline-info"
            ><i class="fas fa-comment"></i>
            <span class="d-none d-sm-inline">Feedback</span></router-link
          >
          <a
            href="#"
            class="btn btn-outline-danger"
            @click="handleDelete(tour.id)"
            ><i class="fas fa-trash"></i>
            <span class="d-none d-sm-inline">Delete</span></a
          >
          <a
            :href="'/trekker/tours/' + tour.id"
            class="btn btn-outline-success"
            target="_blank"
            ><i class="fas fa-eye"></i>
            <span class="d-none d-sm-inline">Preview</span></a
          >
          <router-link
            :to="{ name: 'editTour', params: { tourId: tour.id } }"
            class="btn btn-outline-primary"
            ><i class="fas fa-edit"></i>
            <span class="d-none d-sm-inline">Edit</span></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import Error from "../components/Error.vue";
import { useTourStore } from "@creator/stores/useTourStore";

const tourStore = useTourStore();

const { tours } = storeToRefs(tourStore);
const error = ref(null);
const showCreateForm = ref(false);
const newTitle = ref("");

const toursSortedByTitle = computed(() =>
  [...tours.value].sort((a, b) => (a.title > b.title ? 1 : -1))
);
function handleDelete(tourId) {
  if (!confirm("Are you sure you wish to delete this tour?")) {
    return;
  }
  console.log({ tourId });

  tourStore.deleteTour(tourId).catch((err) => {
    console.error(err);
    error.value = err;
  });
}

function createNew() {
  error.value = null;

  showCreateForm.value = false;
  tourStore.createTour({
    title: newTitle.value,
  });

  newTitle.value = "";
}

onMounted(() => {
  tourStore.fetchTours();
});
</script>

<style scoped>
.card-title {
  margin-bottom: 0px;
}
.fa-check-circle {
  color: green;
}
.fa-globe {
  color: darkblue;
}
.controls {
  white-space: nowrap;
}
</style>

<style>
.ck-editor__editable:not(.ck-editor__nested-editable) {
  min-height: 150px;
}
</style>
