<template>
  <DefaultLayout>
    <div class="home-page container">
      <h1>Camino</h1>
      <ul v-if="tours.length">
        <li v-for="tour in tours" :key="tour.id">
          <router-link :to="`/tours/${tour.id}/stops/0`">
            {{ tour.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { toursService } from "../common/api.service";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const tours = ref([]);

onMounted(async () => {
  tours.value = await toursService.list();
});
</script>

<style></style>
