<template>
  <header class="tour-title my-4">
    <h1 class="my-4">{{ modelValue }}</h1>
    <div class="form-group row">
      <label for="tourTitle" class="col-sm-2 col-form-label">Tour Title</label>
      <div class="col-sm-6">
        <input
          id="tourTitle"
          :value="modelValue"
          type="text"
          class="form-control"
          placeholder=""
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>
  </header>
</template>
<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

defineEmits(["update:modelValue"]);
</script>
