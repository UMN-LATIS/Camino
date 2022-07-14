<template>
  <div class="stage-deepdive-summary">
    <h3>Deep Dives</h3>

    <form
      v-if="['idle', 'failure'].includes(deepDivesStore.sendStatus)"
      class="deepdivesummary-form"
      @submit.prevent="deepDivesStore.emailDeepDives"
    >
      <SanitizedHTML :html="deepDiveSummaryText" />

      <div class="deepdive-select">
        <input
          id="select-all"
          type="checkbox"
          :checked="deepDivesStore.areAllSelected"
          @change="deepDivesStore.toggleAll()"
        />
        <label for="select-all"> Select All </label>
      </div>
      <ul class="deepdive-list">
        <li
          v-for="(deepdive, key) in deepDivesStore.allDeepDives"
          :key="key"
          class="deepdive-item"
        >
          <DeepDivesSummaryItem
            :id="`deepdive-${key}`"
            :title="translate(deepdive.title, trekkerStore.locale)"
            :content="translate(deepdive.text, trekkerStore.locale)"
            :checked="deepdive.isSelected"
            @toggleChecked="deepDivesStore.toggle(deepdive.id)"
          />
        </li>
      </ul>
      <Input
        v-model="deepDivesStore.email"
        class="deepdivesummary-form__input"
        type="email"
        placeholder="you@email.com"
        label="Email"
        required
      />
      <Error v-if="deepDivesStore.error"> {{ deepDivesStore.error }} </Error>
      <div class="form-actions">
        <Button
          class="deepdivesummary-form__button"
          type="submit"
          :disabled="!deepDivesStore.canSendEmail"
        >
          Send
        </Button>
      </div>
    </form>
    <Spinner v-if="deepDivesStore.sendStatus === 'pending'" />
    <Error v-if="deepDivesStore.error"> {{ deepDivesStore.error }} </Error>

    <div v-if="deepDivesStore.sendStatus === 'success'" class="stage__success">
      <p>Your deep dives were sent to {{ deepDivesStore.email }}.</p>
      <div class="form-actions">
        <Button @click="deepDivesStore.softReset()">Show Again</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Error from "../../Error/Error.vue";
import DeepDivesSummaryItem from "./DeepDivesSummaryItem.vue";
import Button from "../../Button/Button.vue";
import Input from "../../Input/Input.vue";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import { translate } from "@/shared/i18n";
import type { DeepDiveSummaryStage } from "@/types";
import SanitizedHTML from "../../SanitizedHTML/SanitizedHTML.vue";
import { useDeepDivesStore } from "@/camino-trekker/stores/useDeepDivesStore";
import Spinner from "@/camino-creator/components/Spinner.vue";

interface Props {
  stage: DeepDiveSummaryStage;
}

const props = defineProps<Props>();

const trekkerStore = useTrekkerStore();
const deepDivesStore = useDeepDivesStore();

const deepDiveSummaryText = computed(
  () => props.stage.text[trekkerStore.locale] || ""
);
</script>

<style scoped>
.stage-deepdive-summary {
  margin: 2rem 0;
  max-width: 30rem;
}

.deepdive-select {
  padding: 0.5rem;
  display: grid;
  grid-template-columns: max-content 1fr auto;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.deepdive-select input {
  width: 1rem;
  height: 1rem;
}

.btn-link {
  border: 0;
  background: transparent;
  text-decoration: underline;
}

.deepdive-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--gray-200);
}
.deepdive-item {
  border-top: 1px solid var(--gray-200);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  gap: 0.5rem;
}
.deepdivesummary-form__button:disabled {
  opacity: 0.25;
}
</style>
