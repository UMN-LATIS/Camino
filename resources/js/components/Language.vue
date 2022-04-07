<template>
  <div v-if="tour.tour_content.languages > 1">
    <p class="mb-0">{{ t("tour.language_selector") }}:</p>
    <div class="offset-1 flex-wrap flex-column language-container">
      <div v-for="(language, key) in tour.tour_content.languages" :key="key">
        <label class="form-check-label">
          <input
            v-model="$i18n.locale"
            :value="language"
            type="radio"
            class="form-check-input"
          />
          {{ language }}
        </label>
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  props: ["stage", "tour"],
  computed: {},
};
</script>
