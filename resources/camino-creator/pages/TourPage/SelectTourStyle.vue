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
<script setup lang="ts">
import { TourStyle } from "@/types";

const descriptions = {
  [TourStyle.NEXT_STOP]: "Only reveal next stop",
  [TourStyle.ENTIRE_TOUR]: "Reveal entire tour",
};

withDefaults(
  defineProps<{
    modelValue: TourStyle;
  }>(),
  {
    modelValue: TourStyle.ENTIRE_TOUR,
  }
);

defineEmits<{
  (eventName: "update:modelValue", tourStyle: TourStyle);
}>();
</script>
