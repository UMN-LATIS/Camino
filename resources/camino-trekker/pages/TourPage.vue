<template>
  <div class="tour-page">
    <DefaultLayout>
      <TourStopSkeleton v-if="isLoading" />
      <div v-else>
        <TourStop v-if="!isLoading" :stopIndex="stopIndex" />
        <BottomNav v-if="!isLoading" />
      </div>
    </DefaultLayout>
  </div>
</template>
<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useStopIndex } from "../common/hooks";
import BottomNav from "../components/BottomNav/BottomNav.vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import TourStopSkeleton from "../components/TourStopSkeleton/TourStopSkeleton.vue";
import TourStop from "../components/TourStop/TourStop.vue";

const store = useStore();
const { stopIndex } = useStopIndex();
const isLoading = computed(() => store.state.isLoading);

onMounted(() => {
  store.dispatch("fetchTour", store.state.route.params.tourId);
});
</script>
<style scoped>
.tour-page {
  height: 100%;
}

.tour-page__stages {
  background: var(--white);
  border-radius: 2rem 2rem 0 0;
  padding-bottom: 10rem;
}

.tour-page__fab-next {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
}
</style>
