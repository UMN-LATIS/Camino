<template>
    <div>        
        <b-button v-b-modal="randomizedModalName" variant="outline-primary"><i class="fas fa-map-marker-alt"></i>  Set Location</b-button>
        
        <b-modal size="lg" :id="randomizedModalName" title="Set Location" ok-only modal-class="modal-fullscreen"
            ok-title='Close'>
            
            <div style="height: 70vh; width: 100%" id="map">


            </div>
            <template v-slot:modal-footer="{ ok }" :locationAvailable="locationAvailable">
                <div class="w-100">

      <b-button @click="useCurrentLocation" v-if="locationAvailable" class="float-left">Use Current Location</b-button>

      <b-button  variant="success" @click="ok()" class="float-right">
        Close
      </b-button>
    </div>
    </template>
        </b-modal>
        
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
        props: ["location", "generalarea", "basemap", "tour"],
        data() {
            return {
                currentLocation: null,
                locationAvailable: false,
                randomIdentifier: Math.round(Math.random() * 100000)
            }
        },
        mounted() {
            this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
                if(modalId == this.randomizedModalName) {
                    this.renderMap();
                }
                
            })
             this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
                 if(modalId == this.randomizedModalName) {
                    this.destroyMap();
                 }
            })            
        },
        computed: {
            randomizedModalName: function() {
                return "navModal" + this.randomIdentifier;
            }
        },
        watch: {
            location: function(newLocation) {
                if(!map) {
                    return;
                }
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
                
                marker = L.marker([newLocation.lat, newLocation.lng], {
                    icon: targetLocationCssIcon
                });
                marker.addTo(map);
                this.drawWalkingPath();
            }
        },
        methods: {
            useCurrentLocation: function() {
                this.$emit("update:location", this.roundCoordinates(this.currentLocation));
            },
            roundCoordinates: function(coordinates) {
                return {"lat": Math.round( coordinates.lat * 100000 + Number.EPSILON ) / 100000, "lng": Math.round( coordinates.lng * 100000 + Number.EPSILON ) / 100000}
            },
            destroyMap: function() {
                if(map) {
                    lc.stop();
                    map.off("locationfound");
                    map.remove();
                }
                map = null;
                myLocation = null;
            },
            drawWalkingPath: function() {
                otherLocationsCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'other-css-icon css-icon',
                    html: '<div class="other_ring"></div>'
                        ,
                    iconSize: [15, 15]
                });
                var targetPoints = this.tour.stops.map(stop => stop.stop_content.stages).map(stages=>{
                    return stages.filter(stage=> stage.type=="navigation").map(nav => nav.targetPoint)
                }).flat();

                

                var otherLocation = null;
                var walkingPath = [];
                var otherLocations = [];
                var foundLocalPoint = false;
                targetPoints.forEach(targetPoint => {
                    if(targetPoint != this.location) {
                        otherLocation = L.marker([targetPoint.lat, targetPoint.lng], {
                        icon: otherLocationsCssIcon
                        });
                        otherLocations.push(otherLocation);
                    }
                    else {
                        foundLocalPoint = true;
                    }
                    walkingPath.push([targetPoint.lat, targetPoint.lng]);
                });


                if(!foundLocalPoint && this.location) {
                    // we must be an unsaved  item
                    walkingPath.push([this.location.lat, this.location.lng]);
                }

                if(otherMarkerGroup) {
                    otherMarkerGroup.clearLayers();
                }
                otherMarkerGroup = L.layerGroup(otherLocations);
                otherMarkerGroup.addTo(map);


                var localPolyline = L.polyline(walkingPath, {
                    color: 'gray',
                    opacity: 0.4
                });
                var decorator = L.polylineDecorator(localPolyline, {
                patterns: [
                        // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                        {offset: 0, repeat: 20, symbol: L.Symbol.dash({pixelSize: 10})}
                    ]
                });
                var decorator2 = L.polylineDecorator(localPolyline, {
                patterns: [
                        // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                        {offset: "100", repeat: 200, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
                    ]
                });
                
                if(polyline) {
                    polyline.clearLayers();
                }

                polyline = L.layerGroup([localPolyline, decorator, decorator2]);
                polyline.addTo(map);

            },
            renderMap: function () {

                console.log("nav");

                map = L.map('map').fitWorld();
                
                if(this.basemap.use_basemap) {
                    var imageUrl = '/storage/' + this.basemap.image,
                imageBounds = [[this.basemap.coords.upperleft.lat, this.basemap.coords.upperleft.lng], [this.basemap.coords.lowerright.lat, this.basemap.coords.lowerright.lng]];
                     L.imageOverlay(imageUrl, imageBounds).addTo(map);

                }
                else {
                    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        accessToken: window.mapbox
                    }).addTo(map);

                }
                // Actual map strategy
                //
                //

            
                targetLocationCssIcon = L.divIcon({
                    // Specify a class name we can refer to in CSS.
                    className: 'target-css-icon css-icon',
                    html: '<div class="target_ring"></div>'
                        ,
                    iconSize: [22, 22]
                });
             

                var self = this;
               

                function onLocationFound(e) {
                    self.currentLocation = e.latlng;
                    self.locationAvailable = true;
                    
                }

                function clickEvent(e) {
                    self.$emit("update:location", self.roundCoordinates(e.latlng));
                }

                if(this.location) {
                    marker = L.marker([this.location.lat, this.location.lng], {
                        icon: targetLocationCssIcon
                    });
                    marker.addTo(map);
                    map.setView(new L.LatLng(this.location.lat, this.location.lng), 16);
                }
                else if(this.generalarea) {
                    map.setView(new L.LatLng(this.generalarea.lat, this.generalarea.lng), 16);
                }
               
                map.on('locationfound', onLocationFound);
                map.on('click', clickEvent); 


                this.drawWalkingPath();

                lc = L.control.locate({
                    showCompass: true,
                    icon: "fa fa-map-marker-alt",
                    locateOptions: {
                        enableHighAccuracy: true,
                        maxZoom: 18
                    }
                }).addTo(map);

            }
        },

    }

</script>
