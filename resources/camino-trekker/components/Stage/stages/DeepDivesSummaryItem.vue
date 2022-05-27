<template>
  <div
    class="deepdivesummary-item"
    :class="{
      'deepdivesummary-item--checked': checked,
      'deepdivesummary-item--expanded': showDetails,
    }"
  >
    <header class="deepdivesummary-item__header">
      <input
        v-show="!checkboxHidden"
        :id="id"
        class="deepdivesummary-item__checkbox"
        type="checkbox"
        :name="id"
        :checked="checked"
        @change="$emit('toggleChecked', !checked)"
      />
      <label :for="id" class="deepdivesummary-item__title">
        {{ title }}
      </label>
      <button
        class="deepdivesummary-item__show-more-toggle"
        @click="toggleShowDetails"
      >
        <span class="sr-only">Show More</span>
        <i class="material-icons">chevron_right</i>
      </button>
    </header>
    <div v-show="showDetails" class="deepdivesummary-item__contents">
      <Markdown :content="content" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Markdown from "../../Markdown/Markdown.vue";
import { ref } from "vue";

interface Props {
  id: string;
  title: string;
  content: string;
  checked?: boolean;
  checkboxHidden?: boolean;
}

withDefaults(defineProps<Props>(), {
  checked: false,
  checkboxHidden: false,
});

interface Emits {
  (eventValue: "toggleChecked", isChecked: boolean): void;
}

defineEmits<Emits>();

const showDetails = ref(false);

function toggleShowDetails() {
  showDetails.value = !showDetails.value;
}
</script>
<style scoped>
.deepdivesummary-item {
  padding: 0.5rem;
}
.deepdivesummary-item__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  grid-template-columns: max-content 1fr max-content;
  justify-content: space-between;
}

.deepdivesummary-item__title {
  flex: 1;
}

.deepdivesummary-item__show-more-toggle {
  background: none;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  color: #ccc;
}

.deepdivesummary-item--expanded .deepdivesummary-item__show-more-toggle i {
  transform: rotate(90deg);
  transition: transform ease-out 0.1s;
}

.deepdivesummary-item__contents {
  padding-left: 1.75rem;
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  overflow: hidden;
}
</style>
