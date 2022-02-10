<template>
  <div v-if="tour && stop">
    <error :error="error" />
    <div class="mb-2">
      <div class="mb-4">
        <router-link :to="{ name: 'editTour', params: { tourId: tourId } }">{{
          tour.title
        }}</router-link>
        >
        {{ stop.stop_content.title[tour.tour_content.languages[0]] }}
      </div>
      <div>
        <section class="mb-4">
          <language-text
            class="mb-4"
            :languages="tour.tour_content.languages"
            :text.sync="stop.stop_content.title"
          >
            Stop Title
          </language-text>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="header-image-url">
              Image URL</label
            >
            <div class="col-sm-10">
                <input
                type="url"
                class="form-control"
                id="header-image-url"
                placeholder="https://example.com/image.jpg"
                v-model="stop.stop_content.header_image.src"
                />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="header-image-alt">
                Image Alt
            </label
            >
            <div class="col-sm-10">
                <input
                type="text"
                class="form-control col"
                id="header-image-alt"
                placeholder="Description of the image"
                v-model="stop.stop_content.header_image.alt"
                />
            </div>
          </div>
          <div class="header-image__preview">
              <img v-if="stop.stop_content.header_image.src" :src="stop.stop_content.header_image.src" />
          </div>
        </section>

        <draggable v-model="stop.stop_content.stages" handle=".handle">
          <stage
            v-for="(stage, key) in stop.stop_content.stages"
            :key="key"
            :stage="stage"
            v-on:remove="stop.stop_content.stages.splice(key, 1)"
          >
            <component
              :is="stage.type"
              :stage="stage"
              :languages="tour.tour_content.languages"
              :tour="tour"
              :stop="stop"
            >
            </component>
          </stage>
        </draggable>
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
            :href="previewLink"
            v-if="stop.id"
            class="btn btn-outline-success"
            target="_blank"
            ><i class="fas fa-eye"></i>
            <span class="d-none d-sm-inline">Preview</span></a
          >
          <button @click="save" class="btn btn-primary">
            <i class="fas fa-save"></i>
            <span class="d-none d-sm-inline">Save</span>
          </button>
          <save-alert :showAlert.sync="showAlert" />
        </span>

        <div class="col-6">
          <div class="row d-flex justify-content-end">
            <select class="form-control col-3" v-model="newStageType">
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
              @click="addStage"
              :disabled="!newStageType"
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
import draggable from "vuedraggable";
import { get } from "lodash";

export default {
  props: ["stopId", "tourId"],
  components: {
    draggable,
  },
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
          stages: [],
        },
      },
      stop_template: {
        stop_content: {
          title: {
            placeholder: null,
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
  },
  watch: {
    stop: {
      handler: function () {
        this.isDirty = true;
      },
      deep: true,
    },
  },
  methods: {
    addStage: function () {
      this.stop.stop_content.stages.push({
        type: this.newStageType,
      });
      this.newStageType = null;
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
          .then((res) => {
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
    migrateOldStopContent() {
      if (!get(this.stop, "stop_content.header_image")) {
        this.stop.stop_content.header_image =
          this.stop_template.stop_content.header_image;
      }
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
          this.migrateOldStopContent();

          this.$nextTick(() => {
            this.isDirty = false;
          });
        })
        .catch((res) => {
          this.error = res;
        });
      if (this.$can("administer site")) {
        this.stageTypes.language = "Language";
      }
    },
  },
  mounted: function () {
    this.loadTour();
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      if (!window.confirm("Leave without saving?")) {
        return;
      }
    }
    next();
  },
};
</script>
