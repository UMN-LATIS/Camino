<template>
  <div class="v-editor d-flex flex-column-reverse">
    <div ref="editorContainerRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Quill from "quill";
import { Maybe } from "@/types";
import { deepmerge } from "deepmerge-ts";
import handleUploadImage from "./handleUploadImage";
import QuillImageUploader from "quill-image-uploader";
import "quill/dist/quill.snow.css";
import { useThrottleFn } from "@vueuse/shared";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    withImageUpload?: boolean;
  }>(),
  {
    modelValue: "",
    withImageUpload: true,
  }
);

const emit = defineEmits(["update:modelValue", "ready"]);
const editorContainerRef = ref(null);
const quill = ref<Maybe<Quill>>(null);

function setEditorHTML(html) {
  if (!quill.value) {
    console.error("Canot set HTML before quill is initialized");
    return;
  }
  quill.value.root.innerHTML = html;
}

onMounted(async () => {
  if (!editorContainerRef.value) {
    throw new Error(
      "VEditor: cannot setup quill. No editorContainerRef found."
    );
  }

  let quillOptions = {
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "align"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
      ],
    },
    theme: "snow",
  };

  if (props.withImageUpload) {
    Quill.register("modules/imageUploader", QuillImageUploader, true);

    const imageUploaderOptions = {
      modules: {
        toolbar: [["image"]],
        imageUploader: {
          upload: handleUploadImage,
        },
      },
    };

    quillOptions = deepmerge(quillOptions, imageUploaderOptions);
  }

  quill.value = new Quill(editorContainerRef.value, quillOptions);

  const throttledUpdateModelValue = useThrottleFn(() => {
    emit("update:modelValue", quill.value?.root.innerHTML);
  }, 250);

  quill.value.on("text-change", throttledUpdateModelValue);

  // set initial editor
  setEditorHTML(props.modelValue);
});
</script>
<style scoped>
.v-editor {
  background: #f3f3f3;
  border-radius: 0.5rem;
  padding: 1rem;
  padding-top: 0.5rem;
}
</style>

<style>
.v-editor .ql-editor {
  min-height: 10rem;
  border: 0;
}

.v-editor .ql-container.ql-snow {
  font-size: 1rem;
  border: 0;
  width: 100%;
  max-width: 50rem;
}
.v-editor .ql-toolbar.ql-snow {
  border: 0;
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  max-width: 50rem;
  width: 100%;
}

.v-editor .ql-toolbar.ql-snow button {
  margin-right: 0.125rem;
}

.v-editor .ql-toolbar.ql-snow button.ql-active {
  background: #333;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.25rem;
  border-radius: 50%;
  margin-top: -0.125rem;
  margin-bottom: -0.125rem;
}

.v-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
  stroke: #fff;
}

.v-editor .ql-editor p,
.v-editor .ql-editor ol,
.v-editor .ql-editor ul,
.v-editor .ql-editor pre,
.v-editor .ql-editor blockquote,
.v-editor .ql-editor h1,
.v-editor .ql-editor h2,
.v-editor .ql-editor h3,
.v-editor .ql-editor h4,
.v-editor .ql-editor h5,
.v-editor .ql-editor h6 {
  margin-bottom: 1rem;
}
</style>
