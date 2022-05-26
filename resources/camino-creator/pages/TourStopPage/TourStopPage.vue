<template>
  <div>
    <Error :error="error" />
    <div class="mb-2">
      <div class="mb-4">
        <router-link :to="{ name: 'editTour', params: { tourId } }">{{
          tourTitle
        }}</router-link>
        >
        {{ stop.stop_content.title[defaultTourLanguage] }}
      </div>

      <div>
        <section class="mb-4">
          <LanguageText
            v-model:text="stop.stop_content.title"
            class="mb-4"
            :languages="tourLanguages"
          >
            Stop Title
          </LanguageText>
          <LanguageText
            v-model:text="stop.stop_content.subtitle"
            class="mb-4"
            :languages="tourLanguages"
          >
            Subtitle
          </LanguageText>
          <ImageUpload
            :imageSrc="stop.stop_content.header_image.src"
            class="mb-4"
            @imageuploaded="handleImageUpload"
          />
          <button
            v-if="stop.stop_content.header_image.src"
            class="btn btn-outline-danger float-right"
            @click="removeHeaderImage"
          >
            <i class="fas fa-trash"></i> Remove Image
          </button>
          <div v-if="stop.stop_content.header_image.src" class="form-group row">
            <label class="col-sm-2 col-form-label" for="header-image-alt">
              Image Alt
            </label>
            <div class="col-sm-10">
              <input
                id="header-image-alt"
                v-model="stop.stop_content.header_image.alt"
                type="text"
                class="form-control col"
                placeholder="Description of the image"
              />
            </div>
          </div>
        </section>

        <!-- <draggable v-model="stop.stop_content.stages" handle=".handle"> -->
        <Stage
          v-for="stage in stop.stop_content.stages"
          :key="stage.id"
          :stage="stage"
          :tour="tourStore.getTour(tourId)"
          :stop="stop"
          :tourId="tourId"
          :stopId="stopId"
          @update="(updatedStage) => handleStageUpdate(stage.id, updatedStage)"
          @remove="handleDeleteStage(stage.id)"
        />
        <!-- </draggable> -->
      </div>
    </div>

    <div v-if="errors.length > 0" class="alert alert-danger" role="alert">
      <strong>Errors</strong>
      <ul>
        <li v-for="(err, key) in errors" :key="key">
          {{ err }}
        </li>
      </ul>
    </div>
    <div class="row mt-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <span>
          <router-link
            :to="{ name: 'editTour', params: { tourId: tourId } }"
            class="btn btn-outline-secondary"
          >
            <i class="fas fa-arrow-left"></i>
            <span class="d-none d-sm-inline">Back to Tour</span></router-link
          >
          <a
            v-if="stop.id"
            :href="previewLink"
            class="btn btn-outline-success"
            target="_blank"
            ><i class="fas fa-eye"></i>
            <span class="d-none d-sm-inline">Preview</span></a
          >
          <button class="btn btn-primary" @click="save">
            <i class="fas fa-save"></i>
            <span class="d-none d-sm-inline">Save!</span>
          </button>
          <SaveAlert v-model:show-alert="showSaveSuccessful" />
        </span>

        <div class="col-6">
          <div class="row d-flex justify-content-end">
            <select
              v-model="newStageType"
              class="form-select"
              aria-label="Select a Stage"
            >
              <option disabled>Select a Stage Type</option>
              <option
                v-for="(stageTypeName, stageTypeKey) in stageTypes"
                :key="stageTypeKey"
                :value="stageTypeKey"
              >
                {{ stageTypeName }}
              </option>
            </select>

            <button
              class="btn btn-primary"
              :disabled="!newStageType"
              @click="handleAddStage"
            >
              <i class="fas fa-plus"></i> Add a Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import draggable from "vuedraggable";
import { mergeDeepRight } from "ramda";
import { ref, computed, onMounted, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import usePermissions from "../../hooks/usePermissions";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Error from "../../components/Error.vue";
import LanguageText from "../../components/LanguageText.vue";
import ImageUpload from "../../components/ImageUpload.vue";
import Stage from "../../components/Stage/Stage.vue";
import SaveAlert from "../../components/SaveAlert.vue";
import createDefaultStop from "../../common/createDefaultStop.js";
import stageFactory from "../../components/Stage/stages/stageFactory";
import { StageType } from "../../../types";

const props = defineProps({
  tourId: {
    type: Number,
    required: true,
  },
  stopId: {
    type: Number,
    // new stops will be null
    default: null,
  },
});

const tourStore = useCreatorStore();
const { userCan } = usePermissions();
const isSaving = ref(false);
const isDirty = ref(false);
const showSaveSuccessful = ref(false);
const errors = ref([]);
const error = ref(null);
const router = useRouter();
const tourTitle = tourStore.getTourTitle(props.tourId);
const tourLanguages = tourStore.getTourLanguages(props.tourId);
const defaultTourLanguage = tourStore.getDefaultTourLanguage(props.tourId);

const stageTypes = ref({
  [StageType.Separator]: "Separator",
  [StageType.AR]: "AR",
  [StageType.DeepDives]: "Deep Dives",
  [StageType.DeepDivesSummary]: "Deep Dives Summary",
  [StageType.EmbedFrame]: "Embed",
  [StageType.Feedback]: "Feedback",
  [StageType.Guide]: "Guide",
  [StageType.Gallery]: "Gallery",
  [StageType.Navigation]: "Navigation",
  [StageType.Quiz]: "Quiz",
});

if (userCan("administer site")) {
  stageTypes.value[StageType.LanguageSelector] = "Language";
}

const newStageType = ref(null);
const stop = ref(createDefaultStop());

onMounted(() => {
  const currentStop = tourStore.getTourStop(props.tourId, props.stopId);

  // merge with default stop in case new props have been added to the
  // stop since created. For example: `header_image`
  stop.value = mergeDeepRight(stop.value, currentStop);
});

// if there are any object changes
// mark the page as dirty to prevent
// accidentally leaving
watch(stop, () => {
  isDirty.value = true;
});

onBeforeRouteLeave((to, from, next) => {
  // if we're just replacing the route during save step
  // or we haven't made any changes, carry-on...
  if (isSaving.value || !isDirty.value) {
    return next();
  }

  // otherwise confirm we actually want to actually leave
  if (confirm("Leave without saving?")) {
    return next();
  }
});

const previewLink = computed(
  () => `/trekker/tours/${props.tourId}/stops/${stop.value.sort_order}`
);

function handleImageUpload(imgSrc) {
  stop.value.stop_content.header_image.src = `/storage/${imgSrc}`;
}

function handleStageUpdate(stageId, updatedStage) {
  console.log("stageUpdated", { stageId, updatedStage });
  const stageIndex = stop.value.stop_content.stages.findIndex(
    (s) => s.id === stageId
  );

  stop.value.stop_content.stages[stageIndex] = updatedStage;
}

function handleDeleteStage(stageId) {
  stop.value.stop_content.stages = stop.value.stop_content.stages.filter(
    (s) => s.id !== stageId
  );
}

function handleAddStage() {
  if (!newStageType.value) {
    console.error("No stage type selected", newStageType.value);
    return;
  }

  const newStage = stageFactory.create(newStageType.value, {
    languages: tourLanguages,
  });
  console.log("addStage", newStage);
  stop.value.stop_content.stages.push(newStage);
}

function removeHeaderImage() {
  const image = stop.value.stop_content.header_image;
  if (!image.src) {
    return;
  }
  if (confirm("Are you sure you wish to delete this image?")) {
    axios.delete("/creator/image/" + image.src).then(() => {
      stop.value.stop_content.header_image = {
        src: null,
        alt: null,
      };
    });
  }
}

function validate(stop) {
  errors.value = [];
  if (!stop.stop_content.title[defaultTourLanguage]) {
    errors.value.push("A title is required");
  }
  return errors.value.length === 0;
}

function save() {
  if (!validate(stop.value)) return;

  isSaving.value = true;

  console.log("save", { stop: stop.value });
  if (!props.stopId) {
    tourStore
      .createTourStop(props.tourId, stop.value)
      .then(({ payload }) => {
        router.replace(`/creator/${props.tourId}/edit/${payload.id}`);
        isSaving.value = false;
        showSaveSuccessful.value = true;
        isDirty.value = false;
      })
      .catch((err) => {
        console.error(err);
        errors.value.push(err);
      });
  } else {
    tourStore
      .updateTourStop(props.tourId, stop.value)
      .then(() => {
        isSaving.value = false;
        showSaveSuccessful.value = true;
        isDirty.value = false;
      })
      .catch((err) => {
        console.error(err);
        errors.value.push(err);
      });
  }
}
</script>
