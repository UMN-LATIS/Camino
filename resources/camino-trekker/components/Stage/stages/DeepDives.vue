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
            :checked="isChecked(deepdive)"
            @change="setChecked($event.target.checked, deepdive)"
          />
          {{ deepdive.title[locale] }}
        </label>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useLocale } from "../../../common/hooks";

defineProps({
  stage: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const { locale } = useLocale();
const deepDives = computed(() => store.state.deepDives);

function setChecked(checked, deepdive) {
  checked
    ? store.dispatch("addDeepDive", deepdive)
    : store.dispatch("removeDeepDive", deepdive);
}

function isChecked(deepdive) {
  return deepDives.value.indexOf(deepdive) >= 0;
}
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
