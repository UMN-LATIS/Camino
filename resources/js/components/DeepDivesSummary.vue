<template>
  <div v-if="$store.getters.deepdives.length > 0">
    <div v-html="formattedText"></div>

    <div class="form-inline">
      <label for="email" class="sr-only">E-mail address</label>
      <input
        type="email"
        class="form-control mr-2 col-7 col-md-3"
        name=""
        v-model="email"
        id="email"
        placeholder="E-mail address"
        aria-describedby="emailHelpId"
      />
      <button
        type="submit"
        class="btn btn-primary"
        @click="sendDeepDives"
        :disabled="success"
      >
        {{ $t("stage.deepdives.email") }}
      </button>
      <i class="fas fa-check-circle ml-2" v-if="success"></i>
    </div>
    <small id="emailHelpId" class="form-text text-muted">{{
      $t("stage.deepdives.disclaimer")
    }}</small>
    <div
      class="card mt-2 mb-2"
      v-for="(deepdive, key) in $store.getters.deepdives"
      :key="key"
    >
      <div class="card-body">
        <h5 class="card-title">{{ deepdive.title[$i18n.locale] }}</h5>
        <p class="card-text" v-html="deepdive.text[$i18n.locale]"></p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ $t("stage.deepdives.none") }}</p>
  </div>
</template>

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

<script>
export default {
  props: ["stage", "tour"],
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
        .then((res) => {
          this.success = true;
        });
    },
  },
};
</script>
