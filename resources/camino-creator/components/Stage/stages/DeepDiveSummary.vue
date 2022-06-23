<template>
  <div>
    <div class="form-check">
      <label class="form-check-label">
        <input
          type="checkbox"
          class="form-check-input"
          :checked="stage.request_email"
          @change="handleUpdate({ request_email: $event.target.checked })"
        />
        Request Email Addresses
      </label>
    </div>
    <LanguageText
      :text="stage.text"
      :languages="languages"
      :largetext="true"
      @update:text="(text) => handleUpdate({ text })"
    >
      Deep Dive Text
    </LanguageText>
  </div>
</template>

<script setup lang="ts">
import { DeepDiveSummaryStage, Locale, Tour } from "@/types";
import LanguageText from "../../LanguageText.vue";

const props = defineProps<{
  stage: DeepDiveSummaryStage;
  languages: Locale[];
  tour: Tour;
}>();

const emit = defineEmits<{
  (eventName: "update", updatedStage: DeepDiveSummaryStage);
}>();

function handleUpdate(change) {
  emit("update", {
    ...props.stage,
    ...change,
  });
}
</script>
