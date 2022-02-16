<template>
  <div
    class="image-upload"
    :class="{
      'image-upload--has-image': imageSrc,
    }"
  >
    <label class="image-upload__label" for="image-upload-file">
      Choose an image
    </label>

    <div
      v-if="errorText"
      class="image-upload__error alert alert-danger"
      role="alert"
    >
      <strong>Error:</strong>
      {{ errorText }}
    </div>
    <div class="image-upload__dropbox">
      <img
        v-if="imageSrc"
        class="image-upload__preview"
        :src="imageSrc"
        alt="Image uploaded to server"
      />
      <input
        type="file"
        class="image-upload__input"
        @change="onFileChange"
        id="image-upload-file"
        accept="image/gif, image/png, image/jpeg, image/webp"
      />

      <div class="image-upload__status">
        <p v-if="!isUploading">
          Drag your image here to {{ imageSrc ? "replace" : "upload" }} <br />
          or click to browse
        </p>
        <div class="image-upload__spinner" v-if="isUploading">
          <i class="fas fa-spinner fa-spin fa-3x"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isUploading: false,
      errorText: null,
    };
  },
  methods: {
    onFileChange(e) {
      const selectedFile = e.target.files[0];
      this.errorText = null;
      this.isUploading = true;

      const formData = new FormData();
      formData.append("image", selectedFile);

      axios
        .post("/creator/image/store", formData)
        .then((response) => {
          this.isUploading = false;
          if (!response.data.success) {
            console.error(`Error: ${response.data.message}`);
            this.errorText = response.data.message;
            return;
          }

          // this.imageUrl = `/storage/${response.data.image}`;
          // console.log({ image: response.data.image });
          this.$emit("imageuploaded", response.data.image);
        })
        .catch((error) => {
          console.error({ error });
          this.errorText = error.message;
          this.isUploading = false;
        });
    },
  },
};
</script>
<style scoped>
.image-upload__preview {
  max-width: 400px;
  max-height: 400px;
  position: relative;
  z-index: -1;
}

.image-upload__dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: hsla(0, 0%, 0%, 0.05);
  color: #333;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.image-upload__input {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.image-upload__status {
  font-size: 1.5rem;
}

.image-upload--has-image .image-upload__status {
  display: none;
}

.image-upload--has-image .image-upload__dropbox:hover .image-upload__status {
  display: block;
  position: absolute;
  z-index: 2;
}

.image-upload__dropbox:hover {
  background: hsla(0, 0%, 0%, 0.5);
  outline: 2px dashed #fff;
  color: #fff;
}
</style>
