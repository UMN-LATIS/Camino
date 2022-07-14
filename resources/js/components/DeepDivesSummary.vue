<template>
  <div v-if="$store.getters.deepdives.length > 0">
    <SanitizedHTML :html="formattedText" />

    <div class="form-inline">
      <label for="email" class="sr-only">E-mail address</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="form-control me-2 col-7 col-md-3"
        name=""
        placeholder="E-mail address"
        aria-describedby="emailHelpId"
      />
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="success"
        @click="sendDeepDives"
      >
        {{ t("stage.deepdives.email") }}
      </button>
      <i v-if="success" class="fas fa-check-circle ms-2"></i>
    </div>
    <small id="emailHelpId" class="form-text text-muted">{{
      t("stage.deepdives.disclaimer")
    }}</small>
    <div
      v-for="(deepdive, key) in $store.getters.deepdives"
      :key="key"
      class="card mt-2 mb-2"
    >
      <div class="card-body">
        <h5 class="card-title">{{ deepdive.title[$i18n.locale] }}</h5>
        <SanitizedHTML class="card-text" :html="deepdive.text[$i18n.locale]" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ t("stage.deepdives.none") }}</p>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import SanitizedHTML from "@/camino-trekker/components/SanitizedHTML/SanitizedHTML.vue";

export default {
  components: { SanitizedHTML },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "tour"],
  setup() {
    const { t } = useI18n(); // use as global scope
    return { t };
  },
  data() {
    return {
      email: null,
      success: false,
    };
  },
  computed: {
    formattedText: function () {
      return this.marked(this.purify(this.stage.text[this.$i18n.locale]));
    },
  },
  methods: {
    sendDeepDives: function () {
      axios
        .post("/emailDeepDives", {
          email: this.email,
          deepDives: this.$store.getters.deepdives,
        })
        .then(() => {
          this.success = true;
        });
    },
  },
};
</script>

<style scoped>
.card-title {
  text-transform: capitalize;
}

.form-inline .form-control {
  display: inline-block !important;
  width: auto !important;
}

.fa-check-circle {
  color: green;
  font-size: 1.4em;
}
</style>
