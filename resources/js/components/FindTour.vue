<template>
    <div>
        <div style="height: 70vh; width: 100%" id="map">


        </div>



    </div>
</template>

<script>
var map;
var lc;
    export default {
        data() {
            return {
                tours: []
            }
        },
        mounted: function () {
            axios.get("/api/tours")
                .then(res => {
                    this.tours = res.data;
                    this.renderMap();
                });
        },
        methods: {
            renderMap: function () {
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

                this.tours.forEach(targetPoint => {

                    var myIcon = L.icon({
                    // iconSize: [38, 95],
                    iconAnchor: [12, 0],
                    // popupAnchor: [-3, -76],
                        iconUrl: '/images/vendor/leaflet/dist/marker-icon.png',
                        shadowUrl: '/images/vendor/leaflet/dist/marker-shadow.png',
                    // shadowSize: [68, 95],
                    // shadowAnchor: [22, 94]
                });
                    otherLocation = L.marker([targetPoint.start_location.lat, targetPoint.start_location.lng], {
                        title: targetPoint.title,
                        icon: myIcon

                    });
                    otherLocation.bindPopup('<p>' + targetPoint.title + '</p><a href="/tour/' + targetPoint.id + '">Start tour</a>');
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