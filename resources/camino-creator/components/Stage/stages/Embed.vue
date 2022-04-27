<template>
  <div>
    <div class="form-group row">
      <label for="url" class="col-sm-2 col-form-label">URL</label>
      <div class="col-sm-6">
        <input
          id="url"
          type="text"
          class="form-control"
          :value="stage.source"
          aria-describedby="helpId"
          @input="updateStage({ source: $event.target.value })"
        />
        <!-- eslint-enable -->
        <small id="helpId" class="form-text text-muted"
          >Just the web address, with http or https://</small
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stage: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

function updateStage(change) {
  emit("update", {
    ...props.stage,
    ...change,
  });
}
</script>
<style>
.css-icon {
  -webkit-border-radius: 30px;
  height: 10px;
  width: 10px;
  z-index: 10;
}

.target-css-icon {
  border: 3px solid red;
  background-color: red;
}
</style>
