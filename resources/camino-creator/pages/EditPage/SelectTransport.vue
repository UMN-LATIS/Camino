<template>
  <div class="form-group row my-4">
    <label for="tourTitle" class="col-sm-2">Transport</label>
    <div class="col-sm-6">
      <div
        v-for="(transport, index) in transportOptions"
        :key="index"
        class="form-check"
      >
        <label class="form-check-label">
          <input
            :checked="props[transport]"
            type="checkbox"
            class="form-check-input"
            @change="$emit(`update:${transport}`, $event.target.checked)"
          />
          {{ capitalize(transport) }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  walking: {
    type: Boolean,
    default: false,
  },
  biking: {
    type: Boolean,
    default: false,
  },
  driving: {
    type: Boolean,
    default: false,
  },
});

const transportOptions = computed(() => Object.keys(props));
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

defineEmits(["update:walking", "update:biking", "update:driving"]);
</script>
