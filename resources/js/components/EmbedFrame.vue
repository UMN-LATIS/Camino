<template>
  <div>
    <button-modal
      modalName="embedFrame"
      :buttonText="stage.buttonTitle[$i18n.locale]"
      :modalTitle="stage.buttonTitle[$i18n.locale]"
      v-on:modalShown="startFrame"
      v-on:modalClosed="endFrame"
    >
      <div style="height: 70vh; width: 100%; overflow: hidden" v-if="stage">
        <iframe
          height="100%"
          width="100%"
          frameBorder="0"
          :src="source"
        ></iframe>
      </div>
    </button-modal>
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
  mounted() {
    // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  },
  computed: {
    source: function () {
      if (this.closing) {
        return "";
      }
      return this.stage.source;
    },
  },
  methods: {
    startFrame: function (e) {
      this.closing = false;
    },
    endFrame: function () {
      this.closing = true;
    },
  },
};
</script>
