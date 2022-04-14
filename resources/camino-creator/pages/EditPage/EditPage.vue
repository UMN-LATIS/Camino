<template>
  <div>
    <Error :error="error" />

    <TourTitleInput v-model="tour.title" />

    <SelectLanguages v-model="tour.tour_content.languages" />

    <InitialLocation
      v-model="tour.start_location"
      :basemap="tour.tour_content.custom_base_map"
    />

    <div class="form-group row">
      <label for="tourTitle" class="col-sm-1"><b>Transport</b></label>
      <div class="col-sm-6">
        <div class="form-check">
          <label class="form-check-label">
            <input
              v-model="tour.walking"
              type="checkbox"
              class="form-check-input"
              value="1"
            />
            Walk
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input
              v-model="tour.biking"
              type="checkbox"
              class="form-check-input"
              value="1"
            />
            Bike
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input
              v-model="tour.driving"
              type="checkbox"
              class="form-check-input"
              value="1"
            />
            Drive
          </label>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="tourStyle" class="col-sm-1"><b>Tour Style</b></label>
      <div class="col-sm-6">
        <div class="form-check">
          <label class="form-check-label">
            <input
              v-model="tour.style"
              type="radio"
              name="tourStyle"
              class="form-check-input"
              value="entire_tour"
            />
            Reveal entire tour
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input
              v-model="tour.style"
              type="radio"
              name="tourStyle"
              class="form-check-input"
              value="next_stop"
            />
            Only reveal next stop
          </label>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="sharing" class="col-sm-1"><b>Sharing</b></label>
      <div class="col-sm-6">
        <div class="input-group">
          <input
            id=""
            v-model="shareAddress"
            type="text"
            class="form-control"
            name=""
            aria-describedby="helpId"
            placeholder=""
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="share"
            >
              Share
            </button>
          </div>
        </div>

        <small id="helpId" class="form-text text-muted"
          >Enter a full email address</small
        >
        <strong v-if="invitationSent">Invitation Sent</strong>
        <div v-if="tour.users.length > 1">
          <p class="mb-0">Shared With:</p>
          <ul class="mt-0">
            <li v-for="user in tour.users" :key="user.id">{{ user.email }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="form-check">
      <label class="form-check-label">
        <input
          v-model="tour.public"
          type="checkbox"
          class="form-check-input"
          :disabled="!userCan('publish publicly')"
        />
        Public
        <span v-if="!userCan('publish publicly')" class="help-text"
          >(<a href="mailto:mcfa0086@umn.edu">Contact us</a> for permission to
          publish tour publicly)</span
        >
      </label>
    </div>

    <div>
      <div class="form-check">
        <label class="form-check-label">
          <input
            v-model="tour.tour_content.custom_base_map.use_basemap"
            type="checkbox"
            class="form-check-input"
            value="checkedValue"
            checked
          />
          Custom base Map
        </label>
      </div>
      <div v-if="tour.tour_content.custom_base_map.use_basemap">
        <ImageUpload
          v-if="!tour.tour_content.custom_base_map.image"
          :image-src="tour.tour_content.custom_base_map.image"
          @imageuploaded="imageUploaded($event)"
        />
        <div class="row">
          <div class="form-group col-sm-2">
            <label for="upper-left-latitude">Upper Left Latitude</label>
            <input
              id="upper-left-latitude"
              v-model="tour.tour_content.custom_base_map.coords.upperleft.lat"
              type="text"
              class="form-control"
              placeholder=""
            />
          </div>
          <div class="form-group col-sm-2">
            <label for="upper-left-longitude">Upper Left Longitude</label>
            <input
              id="upper-left-latitude"
              v-model="tour.tour_content.custom_base_map.coords.upperleft.lng"
              type="text"
              class="form-control"
              placeholder=""
            />
          </div>
          <div class="form-group col-sm-2">
            <label for="lower-right-latitude">Lower Right Latitude</label>
            <input
              id="upper-left-latitude"
              v-model="tour.tour_content.custom_base_map.coords.lowerright.lat"
              type="text"
              class="form-control"
              placeholder=""
            />
          </div>
          <div class="form-group col-sm-2">
            <label for="lower-right-latitude">Lower Right Longitude</label>
            <input
              id="upper-left-latitude"
              v-model="tour.tour_content.custom_base_map.coords.lowerright.lng"
              type="text"
              class="form-control"
              placeholder=""
            />
          </div>
          <div class="col-sm-2">
            <img
              v-if="tour.tour_content.custom_base_map.image"
              :src="'/storage/' + tour.tour_content.custom_base_map.image"
              class="img-thumbnail rounded"
            />
            <button
              v-if="tour.tour_content.custom_base_map.image"
              class="btn btn-outline-danger float-right"
              @click="tour.tour_content.custom_base_map.image = null"
            >
              <i class="fas fa-trash"></i> Remove basemap
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="form-check">
      <label class="form-check-label">
        <input
          v-model="tour.tour_content.use_template"
          type="checkbox"
          class="form-check-input"
          disabled
        />
        Use standard template
      </label>
    </div>

    <div class="form-check">
      <label class="form-check-label">
        <input v-model="tour.active" type="checkbox" class="form-check-input" />
        Active
        <p v-if="tour.active" id="activeHelpId" class="form-text">
          Tour URL:
          <strong
            ><a :href="tourURL">{{ tourURL }}</a></strong
          ><QrCode :size="120" :text="tourURL"></QrCode>
        </p>
      </label>
    </div>

    <div class="row mt-2">
      <div class="col d-flex justify-content-between align-items-center">
        <h3>Tour Stops</h3>
        <div>
          <router-link
            v-if="tour.id"
            :to="{ name: 'createStop', params: { tourId: tourId } }"
            class="btn btn-primary"
            ><i class="fas fa-plus"></i> Add a Stop</router-link
          >
        </div>
      </div>
    </div>

    <!-- <draggable v-model="tour.stops" :move="checkMove" handle=".handle"> -->
    <div v-for="stop in tour.stops" :key="stop.id" class="card mt-2">
      <div class="card-body d-flex justify-content-between align-items-center">
        <h5 class="card-title">
          <i v-if="!isLockedItem(stop)" class="fas fa-grip-vertical handle"></i>
          {{ stop.stop_content.title[tour.tour_content.languages[0]] }}
        </h5>
        <div class="controls">
          <a
            href="#"
            class="btn btn-outline-danger"
            @click="deleteStop(stop.id)"
            ><i class="fas fa-trash"></i>
            <span class="d-none d-sm-inline">Delete</span></a
          >
          <a
            :href="'/tour/' + tour.id + '/' + stop.sort_order"
            class="btn btn-outline-success"
            target="_blank"
            ><i class="fas fa-eye"></i>
            <span class="d-none d-sm-inline">Preview</span>
          </a>
          <router-link
            :to="{
              name: 'editStop',
              params: { tourId: tourId, stopId: stop.id },
            }"
            class="btn btn-outline-primary"
            ><i class="fas fa-edit"></i>
            <span class="d-none d-sm-inline">Edit</span></router-link
          >
        </div>
      </div>
    </div>
    <!-- </draggable> -->

    <div v-if="errors.length > 0" class="alert alert-danger" role="alert">
      <strong>Errors</strong>
      <ul>
        <li v-for="(err, key) in errors" :key="key">
          {{ err }}
        </li>
      </ul>
    </div>
    <div class="mt-2">
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
import InitialLocation from "../../components/InitialLocation.vue";
import ImageUpload from "../../components/ImageUpload.vue";
import usePermissions from "../../hooks/usePermissions.js";
import TourTitleInput from "./TourTitleInput.vue";
import SelectLanguages from "./SelectLanguages.vue";

const { userCan } = usePermissions();

export default {
  components: {
    Error,
    SaveAlert,
    QrCode,
    InitialLocation,
    ImageUpload,
    TourTitleInput,
    SelectLanguages,
    // draggable,
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
          lng: null,
          lat: null,
        },
        walking: 0,
        biking: 0,
        driving: 0,
        style: "entire_tour",
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
    imageUploaded: function (value) {
      this.tour.tour_content.custom_base_map.image = value;
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
            this.$router.replace("/creator/" + res.data.id);
            this.tour.id = res.data.id;
            this.$set(this.tour, "stops", res.data.stops);
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
    checkMove(e) {
      return this.isDraggable(e.draggedContext);
    },
    isDraggable(context) {
      const { index, futureIndex } = context;
      return !(
        this.isLockedItem(this.tour.stops[index]) ||
        this.isLockedItem(this.tour.stops[futureIndex])
      );
    },
    isLockedItem(stop) {
      return (
        stop.sort_order == 0 ||
        stop.sort_order ==
          this.tour.stops
            .map((s) => s.sort_order)
            .reduce((a, b) => Math.max(a, b))
      );
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
