<template>
  <div>
    <Error :error="error" />
    <div v-if="stop" class="mb-2">
      <div class="mb-4">
        <router-link :to="{ name: 'editTour', params: { tourId } }">{{
          tourTitle
        }}</router-link>
        >
        <span data-cy="stop-title">{{
          stop.stop_content.title[defaultTourLanguage]
        }}</span>
      </div>

      <div>
        <section class="mb-4">
          <LanguageText
            v-model:text="stop.stop_content.title"
            class="mb-4"
            data-cy="stop-title-input-group"
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
            :imageSrc="stop.stop_content.header_image?.src ?? null"
            class="mb-4"
            @imageuploaded="handleImageUpload"
          />
          <button
            v-if="stop.stop_content.header_image"
            class="btn btn-outline-danger float-right"
            @click="removeHeaderImage"
          >
            <i class="fas fa-trash"></i> Remove Image
          </button>
          <div
            v-if="stop.stop_content.header_image?.src"
            class="form-group row"
          >
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

        <Draggable
          v-model="stop.stop_content.stages"
          itemKey="id"
          handle=".handle"
          ghostClass="ghost"
        >
          <template #item="{ element }">
            <Stage
              :stage="element"
              :tour="tour"
              :stop="stop"
              :tourId="tourId"
              :stopId="stopId"
              @update="
                (updatedStage) => handleStageUpdate(element.id, updatedStage)
              "
              @remove="handleDeleteStage(element.id)"
            />
          </template>
        </Draggable>
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
          <a v-if="stopId" :href="previewLink" class="btn btn-outline-success"
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

<script setup lang="ts">
import Draggable from "vuedraggable";
import { ref, computed, onMounted } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import usePermissions from "../../hooks/usePermissions";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import Error from "../../components/Error.vue";
import LanguageText from "../../components/LanguageText.vue";
import ImageUpload from "../../components/ImageUpload.vue";
import Stage from "../../components/Stage/Stage.vue";
import SaveAlert from "../../components/SaveAlert.vue";
import stageFactory from "../../components/Stage/stages/stageFactory";
import { StageType, TourStop, Maybe } from "@/types";

interface Props {
  tourId: number;
  stopId: number;
}

const props = defineProps<Props>();

const creatorStore = useCreatorStore();
const { userCan } = usePermissions();
const isSaving = ref(false);
const showSaveSuccessful = ref(false);
const errors = ref<string[]>([]);
const error = ref(null);
const router = useRouter();
const tour = creatorStore.getTour(props.tourId);
const tourTitle = creatorStore.getTourTitle(props.tourId);
const tourLanguages = creatorStore.getTourLanguages(props.tourId);
const defaultTourLanguage = creatorStore.getDefaultTourLanguage(props.tourId);

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
const stop = ref<Maybe<TourStop>>(null);
const lastSavedStopJson = ref("");

function pageHasUnsavedChanges(): boolean {
  return lastSavedStopJson.value !== JSON.stringify(stop.value);
}

onMounted(async () => {
  await creatorStore.fetchTours();

  stop.value = creatorStore.getTourStop(props.tourId, props.stopId).value;
  lastSavedStopJson.value = JSON.stringify(stop.value);
});

onBeforeRouteLeave((to, from, next) => {
  // if we're just replacing the route during save step
  // or we haven't made any changes, carry-on...
  if (isSaving.value || !pageHasUnsavedChanges()) {
    return next();
  }

  // otherwise confirm we actually want to actually leave
  if (confirm("Leave without saving?")) {
    return next();
  }
});

const previewLink = computed(() =>
  stop.value
    ? `/trekker/tours/${props.tourId}/stops/${stop.value.sort_order}`
    : `/trekker/tours/${props.tourId}`
);

function handleImageUpload(imgSrc) {
  if (!stop.value) {
    throw new Error(`Cannot set header image source: No loaded yet`);
  }

  creatorStore.addStopHeaderImage(props.tourId, props.stopId, {
    src: `/storage/${imgSrc}`,
    alt: "",
  });
}

function handleStageUpdate(stageId, updatedStage) {
  if (!stop.value) {
    throw new Error(`No stop value. Cannot update stage ${stageId}`);
  }

  const stageIndex = stop.value.stop_content.stages.findIndex(
    (s) => s.id === stageId
  );

  stop.value.stop_content.stages[stageIndex] = updatedStage;
}

function handleDeleteStage(stageId) {
  if (!stop.value) {
    throw new Error(`Cannot delete stage ${stageId}. No stop value.`);
  }

  stop.value.stop_content.stages = stop.value.stop_content.stages.filter(
    (s) => s.id !== stageId
  );
}

function handleAddStage() {
  if (!stop.value) {
    throw new Error(`Cannot add stage. No stop value.`);
  }

  if (!newStageType.value) {
    throw new Error("Cannot add stage. No stage type selected.");
  }

  const newStage = stageFactory.create(newStageType.value, {
    languages: tourLanguages,
  });

  stop.value.stop_content.stages.push(newStage);
}

function removeHeaderImage() {
  if (!stop.value) {
    throw new Error(`Cannot remove header image. No stop value.`);
  }

  if (confirm("Are you sure you wish to delete this image?")) {
    creatorStore.deleteStopHeaderImage(props.tourId, props.stopId);
  }
}

function validate(stop) {
  errors.value = [];
  if (!stop.stop_content.title[defaultTourLanguage.value]) {
    errors.value.push("A title is required");
  }
  return errors.value.length === 0;
}

async function saveAsNewStop(tourId: number, newStop: Partial<TourStop>) {
  isSaving.value = true;
  errors.value = [];
  try {
    stop.value = await creatorStore.createTourStop(props.tourId, newStop);
    lastSavedStopJson.value = JSON.stringify(stop.value);
    isSaving.value = false;
    showSaveSuccessful.value = true;
    router.replace(`/creator/${props.tourId}/edit/${stop.value.id}`);
  } catch (err) {
    errors.value.push(String(err));
  }
}

async function updateStop(tourId: number, updatedStop: TourStop) {
  isSaving.value = true;
  errors.value = [];
  try {
    stop.value = await creatorStore.updateTourStop(props.tourId, updatedStop);
    lastSavedStopJson.value = JSON.stringify(stop.value);
    isSaving.value = false;
    showSaveSuccessful.value = true;
  } catch (err) {
    errors.value.push(String(err));
  }
}

async function save() {
  if (!stop.value) throw new Error("cannot save null stop");
  if (!validate(stop.value)) return;

  // if stop id exists, then it's an update, otherwise save as new
  return props.stopId
    ? updateStop(props.tourId, stop.value)
    : saveAsNewStop(props.tourId, stop.value);
}
</script>
