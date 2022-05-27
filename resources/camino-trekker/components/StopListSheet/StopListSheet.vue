<template>
  <Sheet class="stoplist-sheet" title="Tour Stops" @close="$emit('close')">
    <ol class="stoplist">
      <router-link
        v-for="(stop, index) in stops"
        :key="stop.id"
        :to="`/tours/${stop.tour_id}/stops/${index}`"
        @click="$emit('close')"
      >
        <li
          class="stoplist__item"
          :class="{ 'stoplist__item--is-active': index === stopIndex }"
        >
          <div class="stoplist__number">
            {{ index + 1 }}
          </div>
          {{ getStopTitle(stop) }}
        </li>
      </router-link>
    </ol>
  </Sheet>
</template>
<script setup lang="ts">
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { computed } from "vue";
import { useStopIndex, useLocale } from "../../common/hooks";
import Sheet from "../Sheet/Sheet.vue";

defineEmits(["close"]);

const store = useTrekkerStore();
const { stopIndex } = useStopIndex();
const { locale } = useLocale();
const stops = computed(() => store.allStops);
const getStopTitle = (stop) => stop.stop_content.title[locale.value];
</script>
<style scoped>
.stoplist {
  list-style: none;
  padding: 0;
}

.stoplist a {
  color: var(--black);
  text-decoration: none;
}

.stoplist__item {
  --text-color: var(--black);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  transition: all ease 0.2s;
}

.stoplist__item:hover:not(.stoplist__item--is-active),
.stoplist__item:focus:not(.stoplist__item--is-active) {
  color: var(--black);
  background: var(--white);
}

.stoplist__item:active,
.stoplist__item--is-active {
  color: var(--gray-light);
  background: var(--black);
}

.stoplist__item:active .stoplist__number,
.stoplist__item--is-active .stoplist__number {
  border-color: var(--gray-light);
}

.stoplist__number {
  font-size: 0.875rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  min-width: 2rem;
  min-height: 2rem;
  border: 0.125rem solid var(--black);
  border-radius: 0.5rem;
}
</style>
