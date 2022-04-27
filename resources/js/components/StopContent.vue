<template>
  <div
    v-if="tour.stops.length > 0"
    class="container mt-2 mb-2 pb-2 pt-1 components-block"
  >
    <template
      v-for="(stage, index) in currentStop.stop_content.stages"
      :key="index"
    >
      <div class="row mt-1 component-row">
        <div class="col component-column">
          <component
            :is="stage.type"
            :stage="stage"
            :tour="tour"
            :current-stop="currentStop.stop_content"
            :current-stop-id="currentStopId"
          >
          </component>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["currentStop", "tour", "currentStopId"],
};
</script>

<style>
.components-block .component-row:first-child .component-column hr {
  display: none;
}
</style>
