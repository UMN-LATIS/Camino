<template>
  <div class="find-tour-page">
    <div id="map" style="height: 60vh; width: 100%"></div>

    <div class="row mt-2">
      <div class="col d-flex justify-content-center" style="font-size: 1.4em">
        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="walk" type="checkbox" class="form-check-input" />
            <i class="fas fa-walking mr-2"></i>Walk
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="bike" type="checkbox" class="form-check-input" />
            <i class="fas fa-biking mr-2"></i>Bike
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input v-model="drive" type="checkbox" class="form-check-input" />
            <i class="fas fa-car mr-2"></i>Drive
          </label>
        </div>
      </div>
    </div>

    <section class="container my-4">
      <h2 class="tourlist__heading">Public Tours</h2>
      <ul class="tourlist">
        <a
          v-for="tour in tours"
          :key="tour.id"
          :href="`/trekker/tours/${tour.id}`"
        >
          <li class="tour-item">
            <div class="tour-item__image">
              <img
                v-if="getTourImage(tour)"
                :src="getTourImage(tour).src"
                :alt="getTourImage(tour).alt"
              />
              <div v-else class="tour-item__image-fallback">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>
            <div class="tour-item__body">
              <h3 class="tour-item__title">{{ tour.title }}</h3>
              <p v-if="getTourSubtitle(tour)" class="tour-item__subtitle">
                {{ getTourSubtitle(tour) }}
              </p>
            </div>
            <i class="fas fa-chevron-right tour-item__chevron"></i>
          </li>
        </a>
      </ul>
    </section>
  </div>
</template>

<script>
var map;
var lc;
var markerGroup;
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
    getTourImage(tour) {
      return tour.stops[0]?.stop_content?.header_image;
    },
    getTourSubtitle(tour) {
      if (tour?.geocoded?.city && tour?.geocoded?.state) {
        return `${tour.geocoded.city}, ${tour.geocoded.state}`;
      }
      return "";
    },
    updateMarkers: function () {
      var markers = [];
      var otherLocation = null;
      this.tours
        .filter((tour) => {
          return (
            (this.walk && tour.walking == 1) ||
            (this.bike && tour.biking == 1) ||
            (this.drive && tour.driving == 1)
          );
        })
        .forEach((targetPoint) => {
          var myIcon = L.icon({
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

          var iconAppend = "";
          if (targetPoint.transport_type == 0) {
            iconAppend = '<i class="fas fa-walking mr-2"></i>';
          } else if (targetPoint.transport_type == 1) {
            iconAppend = '<i class="fas fa-biking mr-2"></i>';
          } else if (targetPoint.transport_type == 2) {
            iconAppend = '<i class="fas fa-car mr-2"></i>';
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

      var streets = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken: window.mapbox,
        }
      ).addTo(map);
      var satellite = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/satellite-v9",
          accessToken: window.mapbox,
        }
      );
      var baseMaps = {
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
<style scoped>
.find-tour-page {
  background: #f3f4f6;
  color: #111827;
}

.tourlist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
}

.tourlist__heading {
  font-size: 1.25rem;
  font-weight: bold;
}

.tourlist > a {
  text-decoration: none;
  color: #111827;
  background: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: cubic-bezier(0, 0, 0.2, 1) 100ms;
  display: flex;
}

.tour-item {
  width: 100%;
  display: grid;
  grid-template-columns: 8rem 1fr 2rem;
  align-items: center;
  gap: 1rem;
}
.tour-item > a:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.tour-item__image {
  align-self: stretch;
  display: flex;
  background: #e5e7eb;
  align-items: center;
  justify-content: center;
}

.tour-item__image img {
  object-fit: cover;
}

.tour-item__title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}
.tour-item__subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.tour-item__body {
  padding: 1rem 0;
}
.tour-item__chevron {
  color: #d1d5db;
}
.tour-item__image-fallback i {
  font-size: 2rem;
}
</style>
