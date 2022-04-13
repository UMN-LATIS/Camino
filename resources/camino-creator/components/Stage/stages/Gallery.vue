<template>
  <div>
    <div
      v-for="(image, key) in stage.images"
      :key="key"
      class="border rounded p-2 m-2"
    >
      <ImageUpload
        v-if="!image.src"
        :image-src="image.src"
        @imageuploaded="imageUploaded(key, $event)"
      />
      <button
        v-if="image.src"
        class="btn btn-outline-danger float-right"
        @click="removeImage(image, key)"
      >
        <i class="fas fa-trash"></i> Remove Image
      </button>
      <img
        v-if="image.src"
        :src="'/storage/' + image.src"
        class="img-thumbnail mb-2"
        width="200"
      />
      <LanguageText
        :text="image.text"
        :languages="languages"
        :largetext="false"
      >
        Image Description
      </LanguageText>
    </div>
    <!-- FIXME: This is mutating the stage prop! Ignoring for now. -->
    <!-- eslint-disable -->
    <button
      @click="stage.images.push({ src: null, text: { placeholder: null } })"
      class="btn btn-outline-primary"
    >
      <!-- eslint-enable -->
      <i class="fas fa-image"></i> Add image
    </button>
  </div>
</template>

<script>
import LanguageText from "../../LanguageText.vue";
import ImageUpload from "../../ImageUpload.vue";
export default {
  components: {
    LanguageText,
    ImageUpload,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stage", "languages", "tour"],
  created() {
    if (!this.stage.images) {
      this.$set(this.stage, "images", []);
    }
  },
  methods: {
    imageUploaded: function (key, value) {
      // FIXME: This is mutating the stage prop! Ignoring for now.
      // eslint-disable-next-line
      this.stage.images[key].src = value;
    },
    removeImage: function (image, key) {
      if (confirm("Are you sure you wish to delete this image?")) {
        axios.delete("/creator/image/" + image.src).then(() => {
          // FIXME: This is mutating the stage prop! Ignoring for now.
          // eslint-disable-next-line
          this.stage.images.splice(key, 1);
        });
      }
    },
  },
};
</script>
