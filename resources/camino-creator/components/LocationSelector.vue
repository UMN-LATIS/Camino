<template>
  <div>
    <BButton
      data-bs-toggle="modal"
      data-bs-target="#setLocation"
      @click="isModalOpen = !isModalOpen"
      ><i class="fas fa-map-marker-alt"></i> Set Location</BButton
    >

    <BModal
      v-show="isModalOpen"
      id="setLocation"
      title="Set Location"
      @close="isModalOpen = false"
    >
      <div id="map" style="height: 70vh; width: 100%" />
      <template #footer>
        <Alert v-if="!locationAvailable" variant="warning">
          Your current location is unavailable. Check your browser settings.
        </Alert>
        <div
          class="d-flex flex-direction-row-reverse gap-1 justify-content-between w-100"
        >
          <BButton :disabled="!locationAvailable" @click="useCurrentLocation"
            >Use Current Location</BButton
          >
          <BButton
            variant="primary"
            data-bs-dismiss="modal"
            @click="isModalOpen = false"
            >Done
          </BButton>
        </div>
      </template>
    </BModal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-this-alias */
import BButton from "./BButton.vue";
import BModal from "./BModal.vue";
import { useGeolocation } from "@vueuse/core";
import Alert from "./Alert.vue";

let map;
let lc;
let targetLocationCssIcon = null;
let otherLocationsCssIcon = null;
let marker;
let polyline;
let otherMarkerGroup;

export default {
  components: {
    BButton,
    BModal,
    Alert,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["location", "generalarea", "basemap", "tour", "route", "stop"],
  emits: ["update:location", "update:route"],
  setup() {
    const { coords, error: geolocationError } = useGeolocation();

    return {
      coords,
      geolocationError,
    };
  },
  data() {
    return {
      // currentLocation: null,
      // locationAvailable: false,
      randomIdentifier: Math.round(Math.random() * 100000),
      isModalOpen: false,
    };
  },
  computed: {
    randomizedModalName: function () {
      return "navModal" + this.randomIdentifier;
    },
    currentLocation() {
      return {
        lng: this.coords.longitude,
        lat: this.coords.latitude,
      };
    },
    locationAvailable() {
      return !this.geolocationError;
    },
  },
  watch: {
    isModalOpen(isOpen) {
      this.$nextTick(() => (isOpen ? this.renderMap() : this.destroyMap()));
    },
    location() {
      if (!map) {
        return;
      }

      if (!this.tour) {
        this.drawMarker();
        return;
      }
      // a route with less than two points is obviously invalid, just rebuild it
      if (!this.route || this.route.length < 2) {
        let previousStop = null;
        if (!this.stop.id) {
          // this is a new stop, we know it's at the end
          if (this.tour.stops.length >= 2) {
            previousStop = this.tour.stops[this.tour.stops.length - 2];
          }
        } else {
          previousStop =
            this.tour.stops[
              this.tour.stops.findIndex((i) => i == this.stop) - 1
            ];
        }

        if (!previousStop) {
          this.$emit("update:route", []);
          return;
        }

        const targetNav = previousStop.stop_content.stages.filter((stage) => {
          return stage.type == "navigation";
        });
        if (targetNav.length == 0) {
          this.$emit("update:route", []);
          return;
        }
        const previousTarget = targetNav[0].targetPoint;

        const route = [previousTarget, this.location];
        console.log(route);
        this.$emit("update:route", route);
      } else {
        const oldRoute = this.route;
        oldRoute.pop();
        oldRoute.push(this.location);
        this.$emit("update:route", oldRoute);
      }
    },
    route() {
      if (!map) {
        return;
      }
      this.drawWalkingPath();
      this.drawMarker();
      this.drawOtherPoints();
    },
  },
  methods: {
    /**
     * gets a list of all nav stages within the tour
     */
    allNavStages: function () {
      if (!this.tour) {
        return [];
      }
      const navStages = this.tour.stops
        .map((stop) => stop.stop_content.stages)
        .map((stages) => {
          return stages.filter((stage) => stage.type == "navigation");
        })
        .flat();

      return navStages;
    },
    useCurrentLocation: function () {
      const loc = this.roundCoordinates(this.currentLocation);
      this.$emit("update:location", loc);
      map.flyTo(loc);
    },
    roundCoordinates: function (coordinates) {
      return {
        lat: Math.round(coordinates.lat * 100000 + Number.EPSILON) / 100000,
        lng: Math.round(coordinates.lng * 100000 + Number.EPSILON) / 100000,
      };
    },
    destroyMap: function () {
      if (map) {
        lc.stop();
        map.off("locationfound");
        map.remove();
      }
      map = null;
    },
    drawMarker: function () {
      if (!this.location) {
        return;
      }
      targetLocationCssIcon = L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: "target-css-icon css-icon",
        html: '<div class="target_ring"></div>',
        iconSize: [22, 22],
      });
      if (marker) {
        marker.remove();
      }

      marker = L.marker([this.location.lat, this.location.lng], {
        icon: targetLocationCssIcon,
      });
      marker.addTo(map);
    },
    drawOtherPoints: function () {
      const targetNavs = this.allNavStages();
      otherLocationsCssIcon = L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: "other-css-icon css-icon",
        html: '<div class="other_ring"></div>',
        iconSize: [15, 15],
      });
      let otherLocation = null;
      const otherLocations = [];
      targetNavs.forEach((targetPoint) => {
        if (
          targetPoint.targetPoint != this.location &&
          targetPoint.targetPoint
        ) {
          otherLocation = L.marker(
            [targetPoint.targetPoint.lat, targetPoint.targetPoint.lng],
            {
              icon: otherLocationsCssIcon,
            }
          );
          otherLocations.push(otherLocation);
        }
      });
      if (otherMarkerGroup) {
        otherMarkerGroup.clearLayers();
      }
      otherMarkerGroup = L.layerGroup(otherLocations);
      otherMarkerGroup.addTo(map);
    },
    drawWalkingPath: function () {
      const targetNavs = this.allNavStages();
      let localPolyline;
      let decorator;
      let decorator2;
      const layerGroupItems = [];
      let previousPoint = null;

      if (this.location && (!this.stop || !this.stop.id)) {
        targetNavs.push({ targetPoint: this.location, route: this.route });
      }

      targetNavs.forEach((targetPoint) => {
        if (!targetPoint) {
          return;
        }
        if (!targetPoint.targetPoint) {
          return;
        }
        if (!targetPoint.route) {
          previousPoint = targetPoint;
          return;
        }

        // make sure the path is contiguous
        if (previousPoint) {
          targetPoint.route[0] = previousPoint.targetPoint;
        }

        localPolyline = L.polyline(targetPoint.route, {
          color: "gray",
          opacity: 0.4,
        });

        if (targetPoint.route == this.route) {
          localPolyline.editing.enable();
        }

        decorator = L.polylineDecorator(localPolyline, {
          patterns: [
            // defines a pattern of 10px-wide dashes, repeated every 20px on the line
            { offset: 0, repeat: 20, symbol: L.Symbol.dash({ pixelSize: 10 }) },
          ],
        });
        decorator2 = L.polylineDecorator(localPolyline, {
          patterns: [
            // defines a pattern of 10px-wide dashes, repeated every 20px on the line
            {
              offset: "100",
              repeat: 200,
              symbol: L.Symbol.arrowHead({
                pixelSize: 15,
                polygon: false,
                pathOptions: { stroke: true },
              }),
            },
          ],
        });

        layerGroupItems.push(localPolyline, decorator, decorator2);
        previousPoint = targetPoint;
      });

      if (polyline) {
        polyline.clearLayers();
      }

      polyline = L.layerGroup(layerGroupItems);
      polyline.addTo(map);
    },
    renderMap: function () {
      map = L.map("map", {
        drawControl: false,
        tap: false,
      }).fitWorld();

      if (this.basemap.use_basemap) {
        const imageUrl = "/storage/" + this.basemap.image,
          imageBounds = [
            [
              this.basemap.coords.upperleft.lat,
              this.basemap.coords.upperleft.lng,
            ],
            [
              this.basemap.coords.lowerright.lat,
              this.basemap.coords.lowerright.lng,
            ],
          ];
        L.imageOverlay(imageUrl, imageBounds).addTo(map);
      } else {
        const streets = L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
          {
            // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            accessToken: window.mapbox,
          }
        ).addTo(map);
        const satellite = L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
          {
            // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/satellite-v9",
            accessToken: window.mapbox,
          }
        );
        const baseMaps = {
          Streets: streets,
          Satellite: satellite,
        };
        L.control.layers(baseMaps).addTo(map);
      }

      const self = this;

      if (this.location) {
        map.setView(new L.LatLng(this.location.lat, this.location.lng), 16);
      } else if (this.generalarea) {
        map.setView(
          new L.LatLng(this.generalarea.lat, this.generalarea.lng),
          16
        );
      }

      map.on("locationfound", function onLocationFound(e) {
        self.currentLocation = e.latlng;
        self.locationAvailable = true;
      });

      map.on("click", function clickEvent(e) {
        self.$emit("update:location", self.roundCoordinates(e.latlng));
      });

      map.on("draw:editvertex", function vertexEdit(e) {
        self.$emit("update:route", e.poly.getLatLngs());
      });

      this.drawWalkingPath();
      this.drawMarker();
      this.drawOtherPoints();

      lc = L.control
        .locate({
          showCompass: true,
          icon: "fa fa-map-marker-alt",
          locateOptions: {
            enableHighAccuracy: true,
            maxZoom: 18,
          },
        })
        .addTo(map);
    },
  },
};
</script>

<style>
.css-icon {
  -webkit-border-radius: 30px;
  height: 10px;
  width: 10px;
  z-index: 10;
}

.target-css-icon {
  border: 3px solid red;
  background-color: red;
}

.other-css-icon {
  border: 3px solid gray;
  background-color: rgba(194, 143, 143, 1);
  width: 10px;
  height: 10px;
}
</style>
