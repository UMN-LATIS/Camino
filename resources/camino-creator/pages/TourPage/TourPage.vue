<template>
  <div v-if="tour">
    <Error :error="error" />
    <TourTitleInput v-model="tour.title" />
    <SelectLanguages v-model="tour.tour_content.languages" />
    <InitialLocation
      v-model="tour.start_location"
      :basemap="tour.tour_content.custom_base_map"
    />
    <SelectTransport
      v-model:walking="tour.walking"
      v-model:biking="tour.biking"
      v-model:driving="tour.driving"
    />
    <SelectTourStyle v-model="tour.style" />

    <!-- tour needs to be created and have an id before it can be shared
     -->
    <ShareTour v-if="tour.id" v-model:users="tour.users" :tourId="tour.id" />

    <CheckboxInput
      v-model="tour.public"
      label="Public"
      :disabled="!userCan('publish publicly')"
    >
      <small v-if="!userCan('publish publicly')" class="help-text"
        >(<a href="mailto:latistecharch@umn.edu">Contact us</a> for permission
        to publish tour publicly)</small
      >
    </CheckboxInput>

    <SelectCustomBaseMap
      v-model:useBaseMap="tour.tour_content.custom_base_map.use_basemap"
      v-model:imageSrc="tour.tour_content.custom_base_map.image"
      v-model:upperLeftCoord="
        tour.tour_content.custom_base_map.coords.upperleft
      "
      v-model:lowerRightCoord="
        tour.tour_content.custom_base_map.coords.lowerright
      "
    />

    <CheckboxInput
      v-model="tour.tour_content.use_template"
      label="Use standard template"
    />

    <CheckboxInput v-model="tour.active" label="Active">
      <div v-if="tour.active" id="activeHelpId" class="form-text">
        <p>
          Tour URL: <a :href="tourURL">{{ tourURL }}</a>
        </p>
        <p><QrCode :size="120" :value="tourURL" /></p>
      </div>
    </CheckboxInput>

    <TourStopList
      v-if="tour.id && tour.stops"
      :tourId="tour.id"
      :stops="tour.stops"
      :locale="defaultLanguage"
    />

    <div
      v-if="validationErrors.length > 0"
      class="alert alert-danger"
      role="alert"
    >
      <strong>Errors</strong>
      <ul>
        <li v-for="(err, key) in validationErrors" :key="key">
          {{ err }}
        </li>
      </ul>
    </div>
    <div class="mt-2 d-flex gap-1">
      <a
        v-if="tour.id"
        :href="'/trekker/tours/' + tour.id"
        class="btn btn-outline-success"
        target="_blank"
        ><i class="fas fa-eye"></i> Preview</a
      >
      <button class="btn btn-primary" @click="save">
        <i class="fas fa-save"></i> Save
      </button>
      <SaveAlert v-model:show-alert="showAlert" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
// import draggable from "vuedraggable";
import QrCode from "qrcode.vue";
import Error from "../../components/Error.vue";

import SaveAlert from "../../components/SaveAlert.vue";
import InitialLocation from "./InitialLocation.vue";
import usePermissions from "../../hooks/usePermissions";
import TourTitleInput from "./TourTitleInput.vue";
import SelectLanguages from "./SelectLanguages.vue";
import SelectTransport from "./SelectTransport.vue";
import SelectTourStyle from "./SelectTourStyle.vue";
import ShareTour from "./ShareTour.vue";
import CheckboxInput from "../../components/CheckboxInput.vue";
import SelectCustomBaseMap from "./SelectCustomBaseMap.vue";
import TourStopList from "./TourStopList.vue";
import { useCreatorStore } from "@creator/stores/useCreatorStore";
import { Locale, Maybe, Tour } from "@/types";

const { userCan } = usePermissions();

interface Props {
  tourId: number;
}

const props = defineProps<Props>();

const showAlert = ref(false);
const error = ref("");
const creatorStore = useCreatorStore();
const tour = ref<Maybe<Tour>>(null);
const validationErrors = ref<string[]>([]);
const router = useRouter();

const tourURL = computed(() => {
  const { origin } = window.location;
  return `${origin}/trekker/tours/${props.tourId}`;
});

const defaultLanguage = computed(
  () => tour.value?.tour_content.languages[0] ?? Locale.en
);

onMounted(() => {
  // load existing tour info
  tour.value = creatorStore.getTour(props.tourId);
});

function validate(tour: Tour): boolean {
  validationErrors.value = [];

  if (!tour.title) {
    validationErrors.value.push("A title is required");
  }
  if (!tour.start_location) {
    validationErrors.value.push("A start location is required");
  }
  if (tour.tour_content.languages.length === 0) {
    validationErrors.value.push("At least one language is required");
  }

  return !validationErrors.value.length;
}

async function createNewTourAndGo(tour: Tour) {
  try {
    const newTour = await creatorStore.createTour(tour);
    router.replace({ name: "editTour", params: { tourId: newTour.id } });
  } catch (err) {
    error.value = String(err);
  }
}

async function save() {
  error.value = "";
  if (!tour.value || !validate(tour.value)) return;

  // create new tour if this doesn't have id yet
  tour.value.id
    ? createNewTourAndGo(tour.value)
    : creatorStore.updateTour(tour.value);
  showAlert.value = true;
}
</script>

<style scoped>
.col-form-label {
  font-weight: bold;
}

.card-title {
  margin-bottom: 0px;
}
</style>
