<template>
  <div class="v-editor d-flex flex-column-reverse">
    <div ref="editorContainerRef"></div>
    <Alert v-if="uploadError" @close="uploadError = null">
      {{ uploadError }}
    </Alert>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Alert from "@/camino-trekker/components/Alert/Alert.vue";
import useQuill from "../hooks/useQuill.js";

const uploadError = ref("");

const handleUploadImage = (file) => {
  const imageUploadUrl = "/creator/image/store";

  const form = new FormData();
  form.append("image", file);

  return axios
    .post(imageUploadUrl, form)
    .then((res) => {
      return `/storage/${res.data.image}`;
    })
    .catch((err) => {
      uploadError.value = `Could not store this image: ${err.response}`;
      console.error(err);
    });
};

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  modules: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "ready"]);
const editorContainerRef = ref(null);

const {
  onAttachImage,
  onTextChange,
  setHTML: setEditorHTML,
} = useQuill({
  editorContainerRef,
  options: {
    // theme: "bubble",
    ...props.options,
  },
  modules: props.modules,
});

const removeImageHandler = onAttachImage(handleUploadImage);
onUnmounted(removeImageHandler);

const removeTextChangeHandler = onTextChange((contents) => {
  emit("update:modelValue", contents);
});

onMounted(() => {
  setEditorHTML(props.modelValue);
});

onUnmounted(removeTextChangeHandler);
</script>
<style scoped>
.v-editor {
  background: #f3f3f3;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>

<style>
.ql-editor {
  min-height: 10rem;
  border: 0;
}

.ql-container.ql-snow {
  font-size: 1rem;
  border: 0;
}
.ql-toolbar.ql-snow {
  border: 0;
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.ql-toolbar.ql-snow button {
  margin-right: 0.125rem;
}

.ql-toolbar.ql-snow button.ql-active {
  background: #333;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.25rem;
  border-radius: 50%;
  margin-top: -0.125rem;
  margin-bottom: -0.125rem;
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke {
  stroke: #fff;
}

.ql-editor p,
.ql-editor ol,
.ql-editor ul,
.ql-editor pre,
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6 {
  margin-bottom: 1rem;
}
</style>
