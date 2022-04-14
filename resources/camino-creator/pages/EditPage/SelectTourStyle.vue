<template>
  <div class="form-group row my-4">
    <label for="tourStyle" class="col-sm-2">Tour Style</label>
    <div class="col-sm-6">
      <div
        v-for="(tourStyleDescription, tourStyleValue) in descriptions"
        :key="tourStyleValue"
        class="form-check"
      >
        <label class="form-check-label">
          <input
            type="radio"
            name="tourStyle"
            class="form-check-input"
            :checked="tourStyleValue === modelValue"
            @change="$emit('update:modelValue', tourStyleValue)"
          />
          {{ tourStyleDescription }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { TOUR_STYLES } from "../../common/constants.js";

const { NEXT_STOP, ENTIRE_TOUR } = TOUR_STYLES;

const descriptions = {
  [NEXT_STOP]: "Only reveal next stop",
  [ENTIRE_TOUR]: "Reveal entire tour",
};

defineProps({
  modelValue: {
    type: String,
    default: TOUR_STYLES.ENTIRE_TOUR,
  },
});

defineEmits(["update:modelValue"]);
</script>
