<template>
  <section class="deepdive-stage">
    <h3>Dive Deeper</h3>
    <p>Learn more about these topics after the tour ends:</p>
    <ul class="deepdive-stage__list">
      <li
        v-for="(deepdive, index) in stage.deepdives"
        :key="index"
        class="form-check"
      >
        <label class="form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            :value="deepdive"
            :checked="deepDivesStore.isSelected(deepdive.id)"
            @change="deepDivesStore.toggle(deepdive.id)"
          />
          {{ deepdive.title[trekkerStore.locale] }}
        </label>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useDeepDivesStore } from "@/camino-trekker/stores/useDeepDivesStore";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import type { DeepDiveStage } from "@/types";

interface Props {
  stage: DeepDiveStage;
}

defineProps<Props>();

const trekkerStore = useTrekkerStore();
const deepDivesStore = useDeepDivesStore();
</script>

<style scoped>
.deepdive-stage {
  background: var(--gray-lighter);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 00.25rem;
  box-shadow: 0 1px 6px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.deepdive-stage__list {
  list-style: none;
  padding-left: 1rem;
}
</style>
