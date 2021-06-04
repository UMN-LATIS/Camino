<template>
    <div>
        <hotwords :text="formattedText" >
        </hotwords>
        <button-modal v-if="stage.targetPoint" modalName="nav" :buttonText="stage.buttonTitle[$i18n.locale]" buttonIcon="far fa-map" :modalTitle="stage.buttonTitle[$i18n.locale]" v-on:modalShown="renderMap" v-on:modalClosed="destroyMap">
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
var marker;
var polyline;
var otherMarkerGroup;

    export default {
        props: ["stage", "tour"],
        data() {
            return {
            }
        },
        computed: {
            formattedText: function() {
                if(this.stage) {
                    return this.marked(this.purify(this.stage.text[this.$i18n.locale]))
                }
                
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
            allLocations: function() {
                var targetPoints = this.tour.stops.map(stop => stop.stop_content.stages).map(stages=>{
                    return stages.filter(stage=> stage.type=="navigation")
                }).flat();
                return targetPoints;
            },
            drawWalkingPath: function() {
                var targetNavs = this.allLocations();
                var localPolyline;
                var decorator;
                var decorator2;
                var layerGroupItems = [];
                var previousPoint = null;
                targetNavs.forEach((targetPoint, index) => {
                    if(this.tour.style !== "entire_tour" && index >= this.$store.state.maxStop) {
                        return;
                    }
                    if(!targetPoint.route) {
                        previousPoint = targetPoint;
                        return;
                    }
                    
                    // make sure the path is contiguous
                    if(previousPoint) {
                        targetPoint.route[0] = previousPoint.targetPoint;
                    }

                    localPolyline = L.polyline(targetPoint.route, {
                        color: 'gray',
                        opacity: 0.4
                    });
                    
                    decorator = L.polylineDecorator(localPolyline, {
                    patterns: [
                            // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                            {offset: 0, repeat: 20, symbol: L.Symbol.dash({pixelSize: 10})}
                        ]
                    });
                    decorator2 = L.polylineDecorator(localPolyline, {
                    patterns: [
                            // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                            {offset: "100", repeat: 200, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
                        ]
                    });

                    
                    layerGroupItems.push(localPolyline, decorator, decorator2);
                    previousPoint = targetPoint;
                });

                
                if(polyline) {
                    polyline.clearLayers();
                }

                polyline = L.layerGroup(layerGroupItems);
                polyline.addTo(map);

            },
            drawMarker: function() {
                
                targetLocationCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'target-css-icon css-icon',
                    html: '<div class="target_ring"></div>'
                        ,
                    iconSize: [22, 22]
                });
                if(marker) {
                    marker.remove();
                }             
                
                marker = L.marker([this.stage.targetPoint.lat,this.stage.targetPoint.lng], {
                    icon: targetLocationCssIcon
                });
                marker.addTo(map);
            },
            drawOtherPoints: function() {
                var targetNavs = this.allLocations();
                otherLocationsCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'other-css-icon css-icon',
                    html: '<div class="other_ring"></div>'
                        ,
                    iconSize: [15, 15]
                });
                var otherLocation = null;
                var otherLocations = [];
                targetNavs.forEach((targetPoint, index) => {
                    if(this.tour.style !== "entire_tour" && index >= this.$store.state.maxStop) {
                        return;
                    }
                    if(targetPoint.targetPoint != this.stage.targetPoint) {
                        otherLocation = L.marker([targetPoint.targetPoint.lat, targetPoint.targetPoint.lng], {
                        icon: otherLocationsCssIcon
                        });
                        otherLocations.push(otherLocation);
                    }
                });
                if(otherMarkerGroup) {
                    otherMarkerGroup.clearLayers();
                }
                otherMarkerGroup = L.layerGroup(otherLocations);
                otherMarkerGroup.addTo(map);


            },
            renderMap: function (e) {

                map = L.map('map', {
                    tap: false
                });
                if(this.tour.tour_content.custom_base_map.use_basemap) {
                    var imageUrl = '/storage/' + this.tour.tour_content.custom_base_map.image,
                imageBounds = [[this.tour.tour_content.custom_base_map.coords.upperleft.lat, this.tour.tour_content.custom_base_map.coords.upperleft.lng], [this.tour.tour_content.custom_base_map.coords.lowerright.lat, this.tour.tour_content.custom_base_map.coords.lowerright.lng]];
                     L.imageOverlay(imageUrl, imageBounds).addTo(map);
                }
                else {
                    var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        accessToken: window.mapbox
                    }).addTo(map);
                    var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/satellite-v9',
                        accessToken: window.mapbox
                    });
                    var baseMaps = {
                        "Streets": streets,
                        "Satellite": satellite
                    };
                    L.control.layers(baseMaps).addTo(map);

                }
                
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

                if(this.stage.targetPoint) {
                    var targetLocation = L.marker([this.stage.targetPoint.lat, this.stage.targetPoint.lng], {
                        icon: targetLocationCssIcon
                    });
                    map.setView(new L.LatLng(this.stage.targetPoint.lat, this.stage.targetPoint.lng), 17);
                    targetLocation.addTo(map);
                }
                
                this.drawWalkingPath();
                this.drawMarker();
                this.drawOtherPoints();

                // map.on('locationfound', onLocationFound);
                lc = L.control.locate({
                    showCompass: true,
                    locateOptions: {
                        enableHighAccuracy: true,
                        maxZoom: 18
                    }
                }).addTo(map);

                if(!this.$can("edit own tours") || !this.$store.state.config.simulateLocation) {
                    lc.start();
                }
            }
        },

    }

</script>
