<template>
  <div class="gallery-stage">
    <div class="gallery-stage__thumbnails">
      <figure
        v-for="(image, i) in images"
        :key="i"
        class="gallery__figure"
        @click="handleThumbnailClick(i)"
      >
        <div class="gallery-stage__figure-image-wrap">
          <img :src="image.src" :alt="image.alt" loading="lazy" />
        </div>
        <figcaption v-if="image.title" class="gallery-stage__figure-figcaption">
          {{ image.title }}
        </figcaption>
      </figure>

      <!-- all props & events -->
      <VueEasyLightbox
        scrollDisabled
        escDisabled
        moveDisabled
        loop
        :visible="lightboxVisible"
        :imgs="images"
        :index="onStageIndex"
        teleport="body"
        @hide="handleHide"
      ></VueEasyLightbox>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import config from "../../../config";
import VueEasyLightbox from "vue-easy-lightbox";

const props = defineProps({
  stage: {
    type: Object,
    required: true,
  },
  locale: {
    type: String,
    default: "en",
  },
});

const onStageIndex = ref(0);
const images = computed(() =>
  props.stage.images.map((img) => ({
    src: `${config.imageStorageBase}/${img.src}`,
    alt: img.text[props.locale],
    title: img.text[props.locale],
  }))
);
const lightboxVisible = ref(false);
const handleThumbnailClick = (index) => {
  onStageIndex.value = index;
  lightboxVisible.value = true;
};

const handleHide = () => {
  lightboxVisible.value = false;
};
</script>
<style scoped>
.gallery-stage {
  margin: 1rem 0;
  position: relative;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
figure {
  margin: 0;
  padding: 0;
}
.gallery-stage__thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}
.gallery-stage__figure-image-wrap {
  flex: 1;
  overflow: hidden;
}
.gallery__figure {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-light);
  overflow: hidden;
  max-height: 20rem;
  max-width: 20rem;
}
.gallery__figure img {
  transition: all ease 0.5s;
}

.gallery-stage__figure-figcaption {
  display: block;
  font-size: 0.75rem;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: hsla(0, 0%, 0%, 0.5);
  color: var(--white);
}

.gallery__figure:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: hsla(0, 0%, 0%, 0.1);
  opacity: 0%;
  transition: all ease 0.5s;
  z-index: 5;
}
.gallery__figure:hover img {
  transform: scale(101%, 101%);
}

.gallery__figure:hover:before {
  opacity: 100%;
}
</style>
<style>
.vel-modal {
  background: hsla(0, 0%, 0%, 0.8);
  /* TODO: make this happen with autoprefixer */
  -webkit-backdrop-filter: blur(0.5rem);
  backdrop-filter: blur(0.5rem);
}
.vel-btns-wrapper .disable {
  color: transparent;
}
.vel-img-title {
  white-space: normal;
  font-size: 1rem;
  overflow: initial;
  width: 80vw;
  max-width: 50rem;
}
</style>
