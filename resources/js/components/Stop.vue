<template>
  <div v-if="tour" class="bootstrap-fs-modal">
    <navbar :tour="tour" :current-stop-id="currentStopId" />
    <stop-content
      :key="currentStopId"
      class="stop-container"
      :tour="tour"
      :current-stop="tour.stops[currentStopId]"
      :current-stop-id="currentStopId"
    />
    <debug-bar v-if="userCan('edit own tours')" />
  </div>
  <error v-else :error="error" />
</template>

<script>
import usePermissions from "../hooks/usePermissions.js";

const { userCan } = usePermissions();

export default {
  props: ["currentStopId", "status", "tourId"],
  data() {
    return {
      tour: false,
      error: null,
    };
  },
  computed: {},
  watch: {
    $route() {
      document.title =
        this.tour.title +
        " : " +
        this.tour.stops[this.currentStopId].stop_content.title[
          this.$i18n.locale
        ];
      // todo: scroll to stop
      // react to route changes...
    },
  },
  mounted() {
    axios
      .get("/api/tour/" + this.tourId)
      .then((response) => {
        this.tour = response.data;
        if (this.currentStopId == undefined || isNaN(this.currentStopId)) {
          this.$router.replace({ name: "tour", params: { currentStopId: 0 } });
        }
      })
      .catch((error) => (this.error = error));
  },
  methods: {
    userCan,
  },
};
</script>
