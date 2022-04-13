<template>
  <div>
    <Error :error="error" />
    <div class="row d-flex justify-content-between align-items-center">
      <h1>My Tours</h1>
      <div>
        <router-link :to="{ name: 'createTour' }" class="btn btn-primary"
          ><i class="fas fa-plus"></i> Create a New Tour</router-link
        >
      </div>
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
            @click="deleteTour(tour.id)"
            ><i class="fas fa-trash"></i>
            <span class="d-none d-sm-inline">Delete</span></a
          >
          <a
            :href="'/tour/' + tour.id"
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

<script>
import Error from "../components/Error.vue";

export default {
  components: {
    Error,
  },
  data() {
    return {
      tours: [],
      error: null,
    };
  },
  computed: {
    toursSortedByTitle: function () {
      // sort mutates the array, so we need to clone it
      return [...this.tours].sort((a, b) => (a.title > b.title ? 1 : -1));
    },
  },
  mounted: function () {
    this.loadTours();
  },
  methods: {
    deleteTour: function (tour) {
      if (confirm("Are you sure you wish to delete this tour?")) {
        axios
          .delete("/creator/edit/" + tour)
          .then(() => {
            this.loadTours();
          })
          .catch((res) => {
            this.error = res;
          });
      }
    },
    loadTours: function () {
      axios
        .get("/creator?" + Math.random()) // someday do .json routes in laravel
        .then((res) => {
          this.tours = res.data;
          document.title = "Camino: My Tours";
        })
        .catch((res) => {
          this.error = res;
        });
    },
  },
};
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
