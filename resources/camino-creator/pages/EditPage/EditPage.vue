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
        <p><QrCode :size="120" :text="tourURL" /></p>
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

<script>
// Someday, all of this should be moved to a pattern like https://zaengle.com/blog/using-v-model-on-nested-vue-components
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
import { TOUR_STYLES } from "../../common/constants.js";

const { userCan } = usePermissions();

export default {
  components: {
    Error,
    SaveAlert,
    QrCode,
    InitialLocation,
    TourTitleInput,
    SelectLanguages,
    SelectTransport,
    SelectTourStyle,
    ShareTour,
    CheckboxInput,
    SelectCustomBaseMap,
    TourStopList,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["tourId"],
  data() {
    return {
      error: null,
      showAlert: false,
      errors: [],
      shareAddress: "",
      invitationSent: false,
      tour: {
        id: null,
        public: false,
        active: false,
        title: "",
        start_location: {
          lng: 0,
          lat: 0,
        },
        walking: false,
        biking: false,
        driving: false,
        style: TOUR_STYLES.ENTIRE_TOUR,
        tour_content: {
          use_template: true,
          languages: ["English"],
          custom_base_map: {
            use_basemap: false,
            image: null,
            coords: {
              upperleft: {
                lat: null,
                lng: null,
              },
              lowerright: {
                lat: null,
                lng: null,
              },
            },
          },
        },
        stops: [],
        users: [],
      },
    };
  },
  computed: {
    tourURL: function () {
      return (
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" : "") +
        location.port +
        "/tour/" +
        this.tourId
      );
    },
    defaultLanguage() {
      return this.tour.tour_content.languages[0];
    },
  },
  mounted: function () {
    this.loadTour();
  },
  methods: {
    userCan,
    deleteStop: function (stopId) {
      if (confirm("Are you sure you wish to delete this stop?")) {
        axios
          .delete("/creator/edit/" + this.tour.id + "/stop/" + stopId)
          .then(() => {
            this.loadTour();
          })
          .catch((res) => {
            this.error = res;
          });
      }
    },
    validate: function () {
      this.errors = [];
      if (!this.tour.title) {
        this.errors.push("A title is required");
      }
      if (!this.tour.start_location) {
        this.errors.push("A start location is required");
      }
      if (this.tour.tour_content.languages.length == 0) {
        this.errors.push("At least one language is required");
      }
      if (this.errors.length > 0) {
        return false;
      }
      return true;
    },
    share: function () {
      axios
        .post("/creator/" + this.tour.id + "/share", {
          email: this.shareAddress,
        })
        .then(() => {
          this.shareAddress = "";
          this.invitationSent = true;
          setTimeout(() => {
            this.invitationSent = false;
          }, 2000);
        });
    },
    save: function () {
      if (!this.validate()) {
        return;
      }
      if (!this.tour.id) {
        axios
          .post("/creator/edit", this.tour)
          .then((res) => {
            console.log({ res });
            this.$router.replace("/creator/" + res.data.id);
            this.tour.id = res.data.id;
            // this.$set(this.tour, "stops", res.data.stops);
            this.tour.stops = res.data.stops;
            this.showAlert = true;
          })
          .catch((res) => {
            this.error = res;
          });
      } else {
        axios
          .put("/creator/edit/" + this.tour.id, this.tour)
          .then(() => {
            this.showAlert = true;
          })
          .catch((res) => {
            this.error = res;
          });
      }
    },
    loadTour: function () {
      if (this.tourId) {
        axios
          .get("/creator/edit/" + this.tourId)
          .then((res) => {
            this.tour = res.data;
            document.title = "Editing : " + this.tour.title;
          })
          .catch((res) => {
            this.error = res;
          });
      }
    },
  },
};
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
