<template>
  <div>
    <div id="map" style="height: 60vh; width: 100%"></div>

    <div class="row mt-2">
      <div class="col d-flex justify-content-center" style="font-size: 1.4em">
        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="walk" type="checkbox" class="form-check-input" />
            <i class="fas fa-walking me-2"></i>Walk
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="bike" type="checkbox" class="form-check-input" />
            <i class="fas fa-biking me-2"></i>Bike
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="drive" type="checkbox" class="form-check-input" />
            <i class="fas fa-car me-2"></i>Drive
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let map;
let lc;
let markerGroup;
export default {
  data() {
    return {
      tours: [],
      walk: true,
      bike: true,
      drive: true,
    };
  },
  watch: {
    walk: function () {
      this.updateMarkers();
    },
    bike: function () {
      this.updateMarkers();
    },
    drive: function () {
      this.updateMarkers();
    },
  },
  mounted: function () {
    axios.get("/api/tours").then((res) => {
      this.tours = res.data;
      this.renderMap();
    });
  },
  methods: {
    updateMarkers: function () {
      const markers = [];
      let otherLocation = null;
      this.tours
        .filter((tour) => {
          return (
            (this.walk && tour.walking == 1) ||
            (this.bike && tour.biking == 1) ||
            (this.drive && tour.driving == 1)
          );
        })
        .forEach((targetPoint) => {
          const myIcon = L.icon({
            // iconSize: [38, 95],
            iconAnchor: [12, 40],
            popupAnchor: [0, -30],
            iconUrl: "/images/vendor/leaflet/dist/marker-icon.png",
            shadowUrl: "/images/vendor/leaflet/dist/marker-shadow.png",
            // shadowSize: [68, 95],
            // shadowAnchor: [22, 94]
          });
          otherLocation = L.marker(
            [targetPoint.start_location.lat, targetPoint.start_location.lng],
            {
              title: targetPoint.title,
              icon: myIcon,
            }
          );

          let iconAppend = "";
          if (targetPoint.transport_type == 0) {
            iconAppend = '<i class="fas fa-walking me-2"></i>';
          } else if (targetPoint.transport_type == 1) {
            iconAppend = '<i class="fas fa-biking me-2"></i>';
          } else if (targetPoint.transport_type == 2) {
            iconAppend = '<i class="fas fa-car me-2"></i>';
          }
          otherLocation.bindPopup(
            "<p>" +
              targetPoint.title +
              "</p>" +
              iconAppend +
              '<a href="/trekker/tours/' +
              targetPoint.id +
              '">Start tour</a>'
          );
          // otherLocation.addTo(map);

          markers.push(otherLocation);
        });

      if (markerGroup) {
        markerGroup.clearLayers();
      }
      markerGroup = new L.featureGroup(markers);
      markerGroup.addTo(map);
    },
    renderMap: function () {
      if (map) {
        lc.stop();
        map.off("locationfound");
        map.remove();
      }
      map = null;

      map = L.map("map", {
        tap: false,
      });

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

      this.updateMarkers();
      map.fitBounds(markerGroup.getBounds());
      lc = L.control
        .locate({
          showCompass: true,
          locateOptions: {
            enableHighAccuracy: true,
            maxZoom: 13,
          },
        })
        .addTo(map);

      lc.start();
    },
  },
};
</script>
