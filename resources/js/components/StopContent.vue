<template>
  <div
    class="container mt-2 mb-2 pb-2 pt-1 components-block"
    v-if="tour.stops.length > 0"
  >
    <template v-for="(stage, index) in currentStop.stop_content.stages">
      <div class="row mt-1 component-row" :key="index">
        <div class="col component-column">
          <component
            :is="stage.type"
            :stage="stage"
            :tour="tour"
            :currentStop="currentStop.stop_content"
            :currentStopId="currentStopId"
          >
          </component>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.components-block .component-row:first-child .component-column hr {
  display: none;
}
</style>

<script>
export default {
  props: ["currentStop", "tour", "currentStopId"],
};
</script>
