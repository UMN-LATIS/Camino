<template>
  <div class="card mt-2">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title">
          <i class="fas fa-grip-vertical handle"></i> {{ stage.type }}
        </h5>
        <div class="controls">
          <button
            class="btn btn-outline-danger"
            @click="$emit('remove', stage)"
          >
            <i class="fas fa-trash"></i> Remove Stage
          </button>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage"],
  emits: ["remove"],
};
</script>
<style scoped>
/*Make this global */
.card-title {
  margin-bottom: 0px;
  text-transform: capitalize;
}
</style>
