<template>
  <div class="d-inline-flex gap-4 p-2">
    <div>
      <small class="d-block">Latitude</small>
      <span data-cy="location-lat">{{
        coord ? coord.lat.toFixed(4) : "-"
      }}</span>
    </div>
    <div>
      <small class="d-block">Longitude</small>
      <span data-cy="location-lng">{{
        coord ? coord.lng.toFixed(4) : "-"
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LngLat, Maybe } from "@/types";

defineProps<{
  coord: Maybe<LngLat>;
}>();
</script>
