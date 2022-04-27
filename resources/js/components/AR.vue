<template>
  <div>
    <ButtonModal
      buttonIcon="fas fa-binoculars"
      modalName="ar"
      :buttonText="t('stage.ar.showar')"
      :modalTitle="t('stage.ar.showar')"
      :disabled="!isMobile"
      @modalShown="startAR"
      @modalClosed="endAR"
    >
      <div v-if="stage" style="height: 70vh; width: 100%; overflow: hidden">
        <iframe
          height="100%"
          width="100%"
          frameBorder="0"
          :src="source"
        ></iframe>
      </div>
    </ButtonModal>
    <div v-if="!isMobile" class="alert alert-primary mt-2" role="alert">
      {{ t("stage.ar.warning") }}
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import usePermissions from "../hooks/usePermissions";

const { userCan } = usePermissions();

export default {
  props: ["stage", "currentStop", "tour"],
  setup() {
    const { t } = useI18n(); // use as global scope
    return { t };
  },
  data() {
    return {
      closing: false,
    };
  },
  computed: {
    source: function () {
      if (this.closing) {
        return "";
      }
      var simulateLocation = userCan("edit own tours")
        ? this.$store.state.config.simulateLocation
        : false;

      return (
        "/ar/" +
        this.tour.id +
        "/" +
        this.$router.currentRoute.params.currentStopId +
        "/" +
        this.$i18n.locale +
        "/" +
        simulateLocation
      );
    },
    isMobile: function () {
      var isMobile =
        "ontouchstart" in document.documentElement &&
        navigator.userAgent.match(/Mobi/);
      if (this.$store.state.config.simulateMobile || isMobile) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  },
  methods: {
    startAR: function () {
      this.closing = false;
    },
    endAR: function () {
      this.closing = true;
    },
  },
};
</script>
