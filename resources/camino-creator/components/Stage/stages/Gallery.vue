<template>
  <div>
    <div
      v-for="(image, index) in stage.images"
      :key="index"
      class="border rounded p-2 m-2"
    >
      <ImageUpload
        v-if="!image.src"
        :imageSrc="image.src"
        @imageuploaded="(src) => handleUpdateImage(index, { src })"
      />
      <button
        v-if="image.src"
        class="btn btn-outline-danger float-end"
        @click="handleRemoveImage(index)"
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
        @update:text="(text) => handleUpdateImage(index, { text })"
      >
        Image Description
      </LanguageText>
    </div>
    <button class="btn btn-outline-primary" @click="handleAddImage">
      <i class="fas fa-image"></i> Add image
    </button>
  </div>
</template>

<script setup lang="ts">
import LanguageText from "../../LanguageText.vue";
import ImageUpload from "../../ImageUpload.vue";
import { useCreatorStore } from "../../../stores/useCreatorStore";
import { createEmptyLocalizedText } from "@/shared/i18n";
import { GalleryStage, GalleryImage } from "@/types";

const props = defineProps<{
  stage: GalleryStage;
  tourId: number;
}>();

const emit = defineEmits<{
  (eventName: "update", stage: GalleryStage);
}>();

const creatorStore = useCreatorStore();
const languages = creatorStore.getTourLanguages(props.tourId);

function handleAddImage() {
  const newImage: GalleryImage = {
    src: "",
    text: createEmptyLocalizedText(languages.value),
  };

  emit("update", {
    ...props.stage,
    images: props.stage.images.concat(newImage),
  });
}

function handleUpdateImage(index, update) {
  const updatedImage = {
    ...props.stage.images[index],
    ...update,
  };
  emit("update", {
    ...props.stage,
    images: [
      ...props.stage.images.slice(0, index),
      updatedImage,
      ...props.stage.images.slice(index + 1),
    ],
  });
}

function handleRemoveImage(index) {
  if (!confirm("Delete this image?")) return;

  // optimistic ui: remove image
  emit("update", {
    ...props.stage,
    images: [
      ...props.stage.images.slice(0, index),
      ...props.stage.images.slice(index + 1),
    ],
  });

  // NOTE: skipping this for now. If the user doesn't save the page,
  // deleting the image will make for a broken src url

  // save image in case deletion fails
  // const imageToRemove = props.stage.images[index];

  // remove from server
  // axios.delete("/creator/image/" + imageToRemove.src).catch((err) => {
  //   console.error(`Cannot remove image from gallery: ${err}`);
  //   // put the image back at index
  //   emit("update", {
  //     ...props.stage,
  //     images: [
  //       ...props.stage.images.slice(0, index),
  //       imageToRemove,
  //       ...props.stage.images.slice(index + 1),
  //     ],
  //   });
  // });
}
</script>
