<template>
    <div>
        <p v-for="(instruction,index) in stage.text[$i18n.locale]" :key="index">
            {{ instruction }}
        </p>
        <button-modal modalName="nav" :buttonText="$t('stage.navigation.showmap')" :modalTitle="$t('stage.navigation.title')"
            v-on:modalShown="renderMap" v-on:modalClosed="destroyMap">
            <div style="height: 70vh; width: 100%" id="map">


            </div>
        </button-modal>
    </div>
</template>

<style>
.css-icon {
    border: 3px solid blue;
    -webkit-border-radius: 30px;
    height: 10px;
    width: 10px;
    z-index: 10;
    background-color: blue;

}
.gps_ring {
    left: -12px;
    top: -12px;
    z-index: 1;
    position: absolute;
    border: 3px solid #999;
    -webkit-border-radius: 30px;
    height: 40px;
    width: 40px;
    -webkit-animation: pulsate 1s ease-out;
    -webkit-animation-iteration-count: infinite;
    /*opacity: 0.0*/
}

@-webkit-keyframes pulsate {
0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
50% {opacity: 1.0;}
100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
}
</style>


<script>

var cssIcon;
var map;
var myLocation = null;

    export default {
        props: ["stage", "tour"],
        data() {
            return {
            }
        },
        methods: {
            destroyMap: function() {
                if(map) {
                    map.off("locationfound");
                    map.remove();
                }
                map = null;
                myLocation = null;
            },
            renderMap: function (e) {
                console.log("nav");
                console.log(e);
                map = L.map('map').fitWorld();
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    accessToken: 'pk.eyJ1IjoiY21jZmFkZGVuIiwiYSI6ImNqN2RycmdtejBlNHgyd3BkZjE3amI4aHAifQ.UTQUqpEmgN0ZEEwZzTbalw'
                }).addTo(map);

                // Actual map strategy
                // var imageUrl = 'map.png',
                //imageBounds = [[44.95134, -93.133163], [44.99134, -93.173163]];
                //      L.imageOverlay(imageUrl, imageBounds).addTo(map);
                //
                //

                
                cssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'css-icon',
                    html: '<div class="gps_ring"></div>'
                        // Set marker width and height
                        ,
                    iconSize: [22, 22]
                    // ,iconAnchor: [11,11]
                });

                var self = this;
                function onLocationFound(e) {
                    console.log("location found");
                    var radius = e.accuracy;

                    var targetLocation = e.latlng;
                    if(self.$store.state.config.simulateLocation) {
                        targetLocation.lat = self.tour.simulatedLatitude;
                        targetLocation.lng = self.tour.simulatedLongitude;
                    }
                    console.log(targetLocation)
                    if (!myLocation) {
                        myLocation = L.marker(targetLocation, {
                            icon: cssIcon
                        });
                        myLocation.addTo(map);

                        map.setView(targetLocation, 18);
                    } else {
                        myLocation.setLatLng(targetLocation);

                    }

                    L.circleMarker([44.97234, -93.152163], {
                        fill: true,
                        radius: 10
                    }).addTo(map);
                }
                map.locate({
                    setView: false,
                    maxZoom: 18,
                    watch: true,
                    enableHighAccuracy: true
                });

                // todo
                var latlngs = [
                    [44.9720, -93.2423],
                    [44.97278, -93.23806],
                    [44.9764, -93.2354]
                ];
                var polyline = L.polyline(latlngs, {
                    color: 'red',
                    opacity: 0.4
                }).addTo(map);

                map.on('locationfound', onLocationFound);
            }
        },

    }

</script>
