<template>
  <div class="stage-deepdive-summary">
    <h3>Deep Dives</h3>

    <Markdown :content="deepDiveSummaryText" />
    <div v-if="stage.request_email" class="deepdive-select">
      <input
        id="select-all"
        type="checkbox"
        :checked="allSelected"
        @change="toggleSelectAll(!allSelected)"
      />
      <label for="select-all"> Select All </label>
    </div>
    <ul class="deepdive-list">
      <li
        v-for="(deepdive, key) in allDeepDives"
        :key="key"
        class="deepdive-item"
      >
        <DeepDivesSummaryItem
          :id="`deepdive-${key}`"
          :title="t(deepdive.title, locale, '')"
          :content="t(deepdive.text, locale, '')"
          :checked="isDeepDiveChecked(deepdive)"
          :checkboxHidden="!stage.request_email"
          @toggleChecked="(isChecked) => setChecked(deepdive, isChecked)"
        />
      </li>
    </ul>
    <form
      v-if="stage.request_email"
      class="deepdivesummary-form"
      @submit.prevent="sendEmail"
    >
      <Input
        v-model="email"
        class="deepdivesummary-form__input"
        type="email"
        placeholder="you@email.com"
        label="Email"
        required
      />
      <Error v-if="error"> {{ error }} </Error>
      <div class="form-actions">
        <Button class="deepdivesummary-form__button" type="submit">
          Send Me a Copy
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import axios from "axios";
import { useTour, useLocale } from "@trekker/common/hooks";
import Markdown from "../../Markdown/Markdown.vue";
import Error from "../../Error/Error.vue";
import getStagesFromTourWhere from "../../../utils/getStagesFromTourWhere";
import DeepDivesSummaryItem from "./DeepDivesSummaryItem.vue";
import Button from "../../Button/Button.vue";
import Input from "../../Input/Input.vue";
import config from "../../../config";
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import t from "@/shared/t";
import type {
  DeepDiveItem,
  DeepDiveSummaryStage,
  DeepDiveStage,
} from "@/types";

interface Props {
  stage: DeepDiveSummaryStage;
}

const props = defineProps<Props>();

const store = useTrekkerStore();
const { tour } = useTour();
const { locale } = useLocale();
const email = ref("");
const isSendingEmail = ref(false);
const isSent = ref(false);
const error = ref("");

const deepDiveSummaryText = computed(
  () => props.stage.text[locale.value] || ""
);
const checkedDeepDives = computed(() => store.deepDives);
const allDeepDives = computed(() => {
  if (!tour.value) return [];
  const deepDiveStages = getStagesFromTourWhere<DeepDiveStage>(
    "type",
    "deepdives",
    tour.value
  );
  const allDeepDives = deepDiveStages.flatMap((stage) => stage.deepdives);
  return allDeepDives;
});

const allSelected = computed(
  () => allDeepDives.value.length === checkedDeepDives.value.length
);

function isDeepDiveChecked(deepDive) {
  return checkedDeepDives.value.indexOf(deepDive) !== -1;
}

const setChecked = (deepdive: DeepDiveItem, isChecked: boolean) => {
  return isChecked
    ? store.addDeepDive(deepdive)
    : store.removeDeepDive(deepdive);
};

function toggleSelectAll(selectAll: boolean) {
  allDeepDives.value.forEach((d) =>
    selectAll ? store.addDeepDive(d) : store.removeDeepDive(d)
  );
}

function sendEmail() {
  isSendingEmail.value = true;
  axios
    .post(`${config.appUrl}/emailDeepDives`, {
      email: email.value,
      deepDives: checkedDeepDives.value,
    })
    .then((response) => {
      console.log({ response });
      isSendingEmail.value = false;
      isSent.value = true;
      email.value = "";
    })
    .catch((err) => {
      isSendingEmail.value = false;
      isSent.value = false;
      error.value = err.message;
    });
}
</script>

<style scoped>
.stage-deepdive-summary {
  max-width: 30rem;
  margin: 2rem 0;
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
</style>
