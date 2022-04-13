<template>
  <div v-if="tour && stop">
    <Error :error="error" />
    <div class="mb-2">
      <div class="mb-4">
        <router-link :to="{ name: 'editTour', params: { tourId } }">{{
          tour.title
        }}</router-link>
        >
        {{ stop.stop_content.title[tour.tour_content.languages[0]] }}
      </div>

      <div>
        <section class="mb-4">
          <LanguageText
            v-model:text="stop.stop_content.title"
            class="mb-4"
            :languages="tour.tour_content.languages"
          >
            Stop Title
          </LanguageText>
          <LanguageText
            v-model:text="stop.stop_content.subtitle"
            class="mb-4"
            :languages="tour.tour_content.languages"
          >
            Subtitle
          </LanguageText>
          <ImageUpload
            :image-src="headerImageSrc"
            class="mb-4"
            @imageuploaded="handleImageUpload"
          />
          <button
            v-if="headerImageSrc"
            class="btn btn-outline-danger float-right"
            @click="removeHeaderImage"
          >
            <i class="fas fa-trash"></i> Remove Image
          </button>
          <div v-if="headerImageSrc" class="form-group row">
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
          v-for="(stage, key) in stop.stop_content.stages"
          :key="key"
          :stage="stage"
          :tour="tour"
          :stop="stop"
          @remove="stop.stop_content.stages.splice(key, 1)"
        />
        <!-- </draggable> -->
      </div>
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
            <span class="d-none d-sm-inline">Save</span>
          </button>
          <SaveAlert v-model:show-alert="showAlert" />
        </span>

        <div class="col-6">
          <div class="row d-flex justify-content-end">
            <select v-model="newStageType" class="form-control col-3">
              <option disabled></option>
              <option
                v-for="(stageType, key) in stageTypes"
                :key="key"
                :value="key"
              >
                {{ stageType }}
              </option>
            </select>

            <button
              class="btn btn-primary"
              :disabled="!newStageType"
              @click="addStage"
            >
              <i class="fas fa-plus"></i> Add a Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import draggable from "vuedraggable";
import { get } from "lodash";
import usePermissions from "../hooks/usePermissions";
import Error from "../components/Error.vue";
import LanguageText from "../components/LanguageText.vue";
import ImageUpload from "../components/ImageUpload.vue";
import Stage from "../components/Stage/Stage.vue";
import SaveAlert from "../components/SaveAlert.vue";

const { userCan } = usePermissions();

export default {
  components: {
    Error,
    LanguageText,
    ImageUpload,
    Stage,
    SaveAlert,
    // draggable,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      if (!window.confirm("Leave without saving?")) {
        return;
      }
    }
    next();
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["stopId", "tourId"],
  data() {
    return {
      error: null,
      isDirty: false,
      localStop: this.stopId,
      showAlert: false,
      newStageType: null,
      stageTypes: {
        separator: "Separator",
        ar: "AR",
        deepdives: "Deep Dives",
        "deepdives-summary": "Deep Dives Summary",
        "embed-frame": "Embed",
        guide: "Guide",
        gallery: "Gallery",
        navigation: "Navigation",
        quiz: "Quiz",
      },
      tour: null,
      stop: {
        stop_content: {
          title: {
            placeholder: null,
          },
          subtitle: {
            placeholder: null,
          },
          stages: [],
        },
      },
      stop_template: {
        stop_content: {
          title: {
            placeholder: null,
          },
          subtitle: {
            English: "",
          },
          header_image: {
            src: null,
            alt: null,
          },
          stages: [
            {
              text: {
                English: "Navigation",
              },
              type: "separator",
            },
            {
              text: {
                placeholder: null,
              },
              type: "navigation",
              buttonTitle: {
                English: "Show Map",
              },
              targetPoint: null,
            },
            {
              text: {
                English: "Guide",
              },
              type: "separator",
            },
            {
              text: {
                placeholder: null,
              },
              type: "guide",
            },
          ],
        },
      },
    };
  },
  computed: {
    previewLink: function () {
      return "/tour/" + this.tour.id + "/" + this.stop.sort_order;
    },
    headerImageSrc() {
      return get(this.stop, "stop_content.header_image.src", null);
    },
    headerImageAlt() {
      return get(this.stop, "stop_content.header_image.alt", null);
    },
  },
  watch: {
    stop: {
      handler: function () {
        this.isDirty = true;
      },
      deep: true,
    },
  },
  mounted: function () {
    this.loadTour();
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.preventNav);
  },
  methods: {
    addStage: function () {
      this.stop.stop_content.stages.push({
        type: this.newStageType,
      });
      this.newStageType = null;
    },
    handleImageUpload(imgSrc) {
      this.stop.stop_content.header_image.src = `/storage/${imgSrc}`;
    },
    removeHeaderImage: function () {
      const image = this.stop.stop_content.header_image;
      if (!image.src) {
        return;
      }
      if (confirm("Are you sure you wish to delete this image?")) {
        axios.delete("/creator/image/" + image.src).then(() => {
          this.stop.stop_content.header_image = {
            src: null,
            alt: null,
          };
        });
      }
    },
    save: function () {
      if (!this.stop.id) {
        axios
          .post("/creator/edit/" + this.tour.id + "/stop/", this.stop)
          .then((res) => {
            this.isDirty = false;
            this.stop.id = res.data.id;
            this.loadTour();
            this.$router.replace({
              name: "editStop",
              params: {
                tourId: this.tourId,
                stopId: this.stop.id,
              },
            });
            this.showAlert = true;
          })
          .catch((res) => {
            this.error = res;
          });
      } else {
        axios
          .put(
            "/creator/edit/" + this.tour.id + "/stop/" + this.stop.id,
            this.stop
          )
          .then(() => {
            this.showAlert = true;
            this.isDirty = false;
          })
          .catch((res) => {
            this.error = res;
          });
      }
    },
    preventNav(event) {
      if (!this.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    },
    addMissingStopContentAttrs() {
      const attrsToAddIfMissing = ["subtitle", "header_image"];

      attrsToAddIfMissing.forEach((attr) => {
        if (typeof get(this.stop.stop_content, attr) === "undefined") {
          this.stop.stop_content[attr] = this.stop_template.stop_content[attr];
        }
      });
    },
    loadTour: function () {
      // cache bust because otherwise we won't reload the tour when using the back button
      axios
        .get("/creator/edit/" + this.tourId + "?" + Math.random())
        .then((res) => {
          this.tour = res.data;
          if (this.stopId) {
            this.stop = this.tour.stops.find((s) => s.id == this.stopId);
          } else if (this.tour.tour_content.use_template) {
            this.stop = this.stop_template;
          }

          // make sure that any new props are added to the stop_content json
          this.addMissingStopContentAttrs();

          this.$nextTick(() => {
            this.isDirty = false;
          });
        })
        .catch((res) => {
          this.error = res;
        });
      if (userCan("administer site")) {
        this.stageTypes.language = "Language";
      }
    },
  },
};
</script>
