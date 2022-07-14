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
        id="image-upload-file"
        type="file"
        class="image-upload__input"
        accept="image/gif, image/png, image/jpeg, image/webp"
        @change="onFileChange"
      />

      <div class="image-upload__status">
        <p v-if="!isUploading">
          Drag your image here to {{ imageSrc ? "replace" : "upload" }} <br />
          or click to browse
        </p>
        <div v-if="isUploading" class="image-upload__spinner">
          <i class="fas fa-spinner fa-spin fa-3x"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Image, Maybe } from "@/types";
import { axiosClient as axios } from "@/shared/axios";

interface Props {
  imageSrc: Maybe<string>;
}
defineProps<Props>();

interface Emits {
  (eventName: "imageuploaded", payload: Maybe<Image>);
}
const emit = defineEmits<Emits>();

const isUploading = ref<boolean>(false);
const errorText = ref<Maybe<string>>(null);

function onFileChange(e: Event) {
  const { files } = e.target as HTMLInputElement;
  if (!files) {
    throw new Error(`No file list exists on target ${e.target}`);
  }

  // if the file was removed from the input
  // we need to reset image source to null
  if (!files.length) {
    emit("imageuploaded", null);
    return;
  }

  const selectedFile = files[0];
  errorText.value = null;
  isUploading.value = true;

  const formData = new FormData();
  formData.append("image", selectedFile);

  axios
    .post("/creator/image/store", formData)
    .then((response) => {
      isUploading.value = false;
      if (!response.data.success) {
        console.error(`Error: ${response.data.message}`);
        errorText.value = response.data.message;
        return;
      }

      emit("imageuploaded", response.data.image);
    })
    .catch((error) => {
      console.error({ error });
      errorText.value = error.message;
      isUploading.value = false;
    });
}
</script>
<style scoped>
.image-upload__preview {
  max-width: 400px;
  max-height: 400px;
  position: relative;
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
