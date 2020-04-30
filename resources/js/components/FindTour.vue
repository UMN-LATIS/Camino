<template>
    <div>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <a class="navbar-brand" href="/">Camino</a>
            <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse"
                data-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavId">
                <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/about">About</a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="/findTours">Find Tours</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/creator">Create</a>
                    </li>
                </ul>

            </div>
        </nav>

        <div style="height: 60vh; width: 100%" id="map">


        </div>

        <div class="row mt-2">
            <div class="col d-flex justify-content-center">
                <div class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="walk">
                        <i class="fas fa-walking mr-2"></i>Walk
                    </label>
                </div>

                <div class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="bike">
                        <i class="fas fa-biking mr-2"></i>Bike
                    </label>
                </div>

                <div class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="drive">
                        <i class="fas fa-car mr-2"></i>Drive
                    </label>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    var map;
    var lc;
    export default {
        data() {
            return {
                tours: [],
                walk: true,
                bike: true,
                drive: true
            }
        },
        mounted: function () {
            axios.get("/api/tours")
                .then(res => {
                    this.tours = res.data;
                    this.renderMap();
                });
        },
        watch: {
            walk: function() {
                this.renderMap();
            },
            bike: function() {
                this.renderMap();
            },
            drive: function() {
                this.renderMap();
            },
        },
        methods: {
            renderMap: function () {
                if(map) {
                    lc.stop();
                    map.off("locationfound");
                    map.remove();
                    
                }
                map = null;

                map = L.map('map');

                L.tileLayer(
                    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        accessToken: 'pk.eyJ1IjoiY21jZmFkZGVuIiwiYSI6ImNqN2RycmdtejBlNHgyd3BkZjE3amI4aHAifQ.UTQUqpEmgN0ZEEwZzTbalw'
                    }).addTo(map);



                var otherLocation = null;
                var walkingPath = [];
                var markers = []

                this.tours.filter(tour => { return ((this.walk && tour.transport_type == 0) || (this.bike && tour.transport_type == 1) || (this.drive && tour.transport_type == 2))}).forEach(targetPoint => {

                    var myIcon = L.icon({
                        // iconSize: [38, 95],
                        iconAnchor: [12, 0],
                        // popupAnchor: [-3, -76],
                        iconUrl: '/images/vendor/leaflet/dist/marker-icon.png',
                        shadowUrl: '/images/vendor/leaflet/dist/marker-shadow.png',
                        // shadowSize: [68, 95],
                        // shadowAnchor: [22, 94]
                    });
                    otherLocation = L.marker([targetPoint.start_location.lat, targetPoint.start_location
                        .lng], {
                        title: targetPoint.title,
                        icon: myIcon

                    });

                    var iconAppend = "";
                    if(targetPoint.transport_type == 0) {
                        iconAppend = '<i class="fas fa-walking mr-2"></i>';
                    }
                    else if(targetPoint.transport_type == 1) {
                        iconAppend = '<i class="fas fa-biking mr-2"></i>';
                    }
                    else if(targetPoint.transport_type == 2) {
                        iconAppend = '<i class="fas fa-car mr-2"></i>';
                    }
                    otherLocation.bindPopup('<p>' + targetPoint.title + '</p>' + iconAppend + '<a href="/tour/' + targetPoint
                        .id + '">Start tour</a>');
                    otherLocation.addTo(map);


                    markers.push(otherLocation);

                });
                console.log(markers);
                var group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds());
                lc = L.control.locate({
                    showCompass: true,
                    locateOptions: {
                        enableHighAccuracy: true,
                        maxZoom: 13
                    }
                }).addTo(map);

                lc.start();
            }
        }
    }
</script>