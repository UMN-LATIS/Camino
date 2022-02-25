<template>
  <div>
    <div
      v-for="(image, key) in stage.images"
      :key="key"
      class="border rounded p-2 m-2"
    >
      <image-upload
        v-if="!image.src"
        @imageuploaded="imageUploaded(key, $event)"
        :imageSrc="image.src"
      />
      <button
        @click="removeImage(image, key)"
        class="btn btn-outline-danger float-right"
        v-if="image.src"
      >
        <i class="fas fa-trash"></i> Remove Image
      </button>
      <img
        :src="'/storage/' + image.src"
        class="img-thumbnail mb-2"
        v-if="image.src"
        width="200"
      />
      <language-text
        :text="image.text"
        :languages="languages"
        :largetext="false"
      >
        Image Description
      </language-text>
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
export default {
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
