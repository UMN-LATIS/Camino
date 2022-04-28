<template>
  <div>
    <ButtonModal
      modalName="embedFrame"
      :buttonText="stage.buttonTitle[$i18n.locale]"
      :modalTitle="stage.buttonTitle[$i18n.locale]"
      @modalShown="startFrame"
      @modalClosed="endFrame"
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
  </div>
</template>

<script>
export default {
  props: ["stage", "currentStop"],
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
      return this.stage.source;
    },
  },
  mounted() {
    // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  },
  methods: {
    startFrame: function () {
      this.closing = false;
    },
    endFrame: function () {
      this.closing = true;
    },
  },
};
</script>
