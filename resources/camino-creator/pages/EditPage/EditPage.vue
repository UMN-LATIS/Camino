<template>
  <div>
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
      v-model:image="tour.tour_content.custom_base_map.image"
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

    <div v-if="errors.length > 0" class="alert alert-danger" role="alert">
      <strong>Errors</strong>
      <ul>
        <li v-for="(err, key) in errors" :key="key">
          {{ err }}
        </li>
      </ul>
    </div>
    <div class="mt-2 d-flex gap-1">
      <a
        v-if="tour.id"
        :href="'/tour/' + tour.id"
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

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
// import draggable from "vuedraggable";
import QrCode from "qrcode.vue";
import Error from "../../components/Error.vue";
import SaveAlert from "../../components/SaveAlert.vue";
import InitialLocation from "./InitialLocation.vue";
import usePermissions from "../../hooks/usePermissions.js";
import TourTitleInput from "./TourTitleInput.vue";
import SelectLanguages from "./SelectLanguages.vue";
import SelectTransport from "./SelectTransport.vue";
import SelectTourStyle from "./SelectTourStyle.vue";
import ShareTour from "./ShareTour.vue";
import CheckboxInput from "../../components/CheckboxInput.vue";
import SelectCustomBaseMap from "./SelectCustomBaseMap.vue";
import TourStopList from "./TourStopList.vue";
import { useTourStore } from "../../stores/tours";
import createDefaultTour from "../../common/createDefaultTour.js";

const { userCan } = usePermissions();

const props = defineProps({
  tourId: {
    type: Number,
    // when creating a new tour this will be null
    default: null,
  },
});

const error = ref(null);
const showAlert = ref(false);
const tourStore = useTourStore();
const tour = ref(createDefaultTour());
const errors = ref([]);
const router = useRouter();

const tourURL = computed(() => {
  const { protocol, host } = window.location;
  return `${protocol}//${host}/tour/${props.tourId}`;
});

const defaultLanguage = computed(
  () => tour.value.tour_content.languages[0] || "English"
);

onMounted(() => {
  if (!props.tourId) return;

  // load existing tour info
  tour.value = tourStore.getTour(props.tourId);
});

function validate(tour) {
  errors.value = [];

  if (!tour.title) {
    errors.value.push("A title is required");
  }
  if (!tour.start_location) {
    errors.value.push("A start location is required");
  }
  if (tour.tour_content.languages.length === 0) {
    errors.value.push("At least one language is required");
  }

  return !errors.value.length;
}

const handleError = (err) => {
  console.error(err);
  errors.value.push(err.message);
};

async function save() {
  if (!validate(tour.value)) return;

  if (!tour.value.id) {
    // create tour
    const { payload } = await tourStore
      .createTour(tour.value)
      .catch(handleError);
    router.replace({ name: "editTour", params: { tourId: payload.id } });
  } else {
    // update tour
    tourStore.updateTour(tour.value).catch(handleError);
  }
  showAlert.value = true;
}
</script>

<style scoped>
.handle {
  cursor: move;
}

.col-form-label {
  font-weight: bold;
}

.card-title {
  margin-bottom: 0px;
}
</style>
