<template>
  <div class="form-group row my-4">
    <label for="tourTitle" class="col-sm-2">Transport</label>
    <div class="col-sm-6">
      <div
        v-for="(transport, index) in ['walking', 'biking', 'driving']"
        :key="index"
        class="form-check"
      >
        <label class="form-check-label">
          <input
            :checked="props[transport]"
            type="checkbox"
            class="form-check-input"
            @change="
              $emit(
                `update:${transport}` as Emit,
                ($event.target as HTMLInputElement).checked
              )
            "
          />
          {{ capitalize(transport) }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    walking?: boolean;
    biking?: boolean;
    driving?: boolean;
  }>(),
  {
    walking: false,
    biking: false,
    driving: false,
  }
);

interface Emit {
  (eventName: "update:walking", isWalkingTour: boolean);
  (eventName: "update:biking", isBikingTour: boolean);
  (eventName: "update:driving", isDrivingTour: boolean);
}

defineEmits<Emit>();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>
