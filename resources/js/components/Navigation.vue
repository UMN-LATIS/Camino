<template>
    <div>
        <p>
            {{  stage.text[$i18n.locale] }}
        </p>
        <button-modal modalName="nav" :buttonText="stage.buttonTitle[$i18n.locale]" :modalTitle="stage.buttonTitle[$i18n.locale]"
            v-on:modalShown="renderMap" v-on:modalClosed="destroyMap">
            <div style="height: 70vh; width: 100%" id="map">


            </div>
        </button-modal>
    </div>
</template>

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
    background-color: rgba(194, 143, 143, 0.514); 
    width: 10px;
    height: 10px;
}

</style>


<script>

var cssIcon;
var map;
var lc;
var myLocation = null;
var myLocationCssIcon = null;
var targetLocationCssIcon = null;
var otherLocationsCssIcon = null;

    export default {
        props: ["stage", "tour"],
        data() {
            return {
            }
        },
        methods: {
            destroyMap: function() {
                if(map) {
                    lc.stop();
                    map.off("locationfound");
                    map.remove();
                    
                }
                map = null;
                myLocation = null;
            },
            renderMap: function (e) {

                console.log("nav");
                console.log(e);
                map = L.map('map');
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
                
                
                targetLocationCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'target-css-icon css-icon',
                    html: '<div class="target_ring"></div>'
                        ,
                    iconSize: [22, 22]
                });
                otherLocationsCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'other-css-icon css-icon',
                    html: '<div class="other_ring"></div>'
                        ,
                    iconSize: [15, 15]
                });

                // var self = this;
                // function onLocationFound(e) {
                //     console.log("location found");
                //     var radius = e.accuracy;

                //     var targetLocation = e.latlng;
                //     if(self.$store.state.config.simulateLocation) {
                //         targetLocation.lat = self.tour.simulatedLatitude;
                //         targetLocation.lng = self.tour.simulatedLongitude;
                //     }
                //     console.log(targetLocation)
                //     if (!myLocation) {
                //         myLocation = L.marker(targetLocation, {
                //             icon: myLocationCssIcon
                //         });
                //         myLocation.addTo(map);

                //         map.setView(targetLocation, 18);
                //     } else {
                //         myLocation.setLatLng(targetLocation);

                //     }

                // }
                // map.locate({
                //     setView: false,
                //     maxZoom: 18,
                //     watch: true,
                //     enableHighAccuracy: true
                // });

                // todo
                // var latlngs = [
                //     [44.9720, -93.2423],
                //     [44.97278, -93.23806],
                //     [44.9764, -93.2354]
                // ];
                // var polyline = L.polyline(latlngs, {
                //     color: 'red',
                //     opacity: 0.4
                // }).addTo(map);

                if(this.stage.targetPoint) {
                    var targetLocation = L.marker([this.stage.targetPoint.lat, this.stage.targetPoint.lng], {
                        icon: targetLocationCssIcon
                    });
                    map.setView(new L.LatLng(this.stage.targetPoint.lat, this.stage.targetPoint.lng), 17);
                    targetLocation.addTo(map);
                }
                var targetPoints = this.tour.stops.map(stop => stop.stages).map(stages=>{
                    return stages.filter(stage=> stage.type=="navigation").map(nav => nav.targetPoint)
                }).flat();

                var otherLocation = null;
                var walkingPath = [];
                targetPoints.forEach(targetPoint => {
                    if(targetPoint != this.stage.targetPoint) {

                        otherLocation = L.marker([targetPoint.lat, targetPoint.lng], {
                        icon: otherLocationsCssIcon
                        });
                        otherLocation.addTo(map);
                    }
                    walkingPath.push([targetPoint.lat, targetPoint.lng]);
                    

                });

                var polyline = L.polyline(walkingPath, {
                        color: 'gray',
                        opacity: 0.4
                    }).addTo(map);
                // map.on('locationfound', onLocationFound);
                lc = L.control.locate({
                    showCompass: true,
                    locateOptions: {
                        enableHighAccuracy: true,
                        maxZoom: 18
                    }
                }).addTo(map);

                if(!this.$store.state.config.simulateLocation) {
                    lc.start();
                }
            }
        },

    }

</script>
