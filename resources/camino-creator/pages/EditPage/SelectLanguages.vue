<template>
  <div class="form-group row my-2">
    <label class="col-sm-2">Languages</label>
    <div class="col-sm-10 flex-wrap flex-column language-container">
      <div v-for="(_, key) in possibleLanguages" :key="key" class="form-check">
        <label class="form-check-label">
          <input
            type="checkbox"
            class="form-check-input"
            :checked="modelValue"
            @change="$emit('update:modelValue', event.target.value)"
          />
          {{ key }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { languages as possibleLanguages } from "../../languages.js";

defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

defineEmits(["update:modelValue"]);
</script>
