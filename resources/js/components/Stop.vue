<template>
  <div v-if="tour" class="bootstrap-fs-modal">
    <Navbar :tour="tour" :currentStopId="currentStopId" />
    <StopContent
      :key="currentStopId"
      class="stop-container"
      :tour="tour"
      :currentStop="tour.stops[currentStopId]"
      :currentStopId="currentStopId"
    />
    <DebugBar v-if="userCan('edit own tours')" />
  </div>
  <Error v-else :error="error" />
</template>

<script>
import usePermissions from "../hooks/usePermissions";

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
