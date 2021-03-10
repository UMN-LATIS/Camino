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
    background-color: rgba(194, 143, 143, 1); 
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
        props: ["location", "generalarea", "basemap", "tour", "route", "stop"],
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

                if(!this.tour) {
                    this.drawMarker();
                    return;
                }
                // a route with less than two points is obviously invalid, just rebuild it
                if(!this.route || this.route.length < 2) {
                    var allLocations = this.allLocations();
                    var previousStop = null;
                    if(!this.stop.id) {
                        // this is a new stop, we know it's at the end
                        if(this.tour.stops.length >= 2) {
                            previousStop = this.tour.stops[this.tour.stops.length - 2];
                        }
                        
                    }
                    else {

                        previousStop = this.tour.stops[this.tour.stops.findIndex((i)=> i == this.stop) - 1];
                    }

                    if(!previousStop) {
                        this.$emit("update:route", []);
                        return;
                    }

                    var targetNav = previousStop.stop_content.stages.filter(stage=>{
                        return stage.type=="navigation"
                    });
                    if(targetNav.length == 0) {
                        this.$emit("update:route", []);
                        return;
                    }
                    var previousTarget = targetNav[0].targetPoint;
                    
                    var route = [previousTarget, this.location];
                    console.log(route);
                    this.$emit("update:route", route);
                }
                else {
                    var oldRoute = this.route;
                    oldRoute.pop();
                    oldRoute.push(this.location);
                    this.$emit("update:route", oldRoute);
                }
                


            },
            route: function(route) {
                if(!map) {
                    return;
                }
                this.drawWalkingPath();
                this.drawMarker();
                this.drawOtherPoints();
            }
        },
        methods: {
            allLocations: function() {
                if(!this.tour) {
                    return [];
                }
                var targetPoints = this.tour.stops.map(stop => stop.stop_content.stages).map(stages=>{
                    return stages.filter(stage=> stage.type=="navigation")
                }).flat();
                
                return targetPoints;
            },
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
            drawMarker: function() {
                if(!this.location) {
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
                
                marker = L.marker([this.location.lat, this.location.lng], {
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
                targetNavs.forEach(targetPoint => {
                    if(targetPoint.targetPoint != this.location && targetPoint.targetPoint) {
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
            drawWalkingPath: function() {

                var targetNavs = this.allLocations();
                var localPolyline;
                var decorator;
                var decorator2;
                var layerGroupItems = [];
                var previousPoint = null;

                if(this.location && (!this.stop || !this.stop.id)) {
                    targetNavs.push({"targetPoint": this.location, "route": this.route})
                }

                targetNavs.forEach(targetPoint => {
                    if(!targetPoint.targetPoint) {
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

                    if(targetPoint.route == this.route) {
                        localPolyline.editing.enable();
                    }
                    
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
            renderMap: function () {


                map = L.map('map', {drawControl: false}).fitWorld();
                
                if(this.basemap.use_basemap) {
                    var imageUrl = '/storage/' + this.basemap.image,
                imageBounds = [[this.basemap.coords.upperleft.lat, this.basemap.coords.upperleft.lng], [this.basemap.coords.lowerright.lat, this.basemap.coords.lowerright.lng]];
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


                var self = this;
            
                function onLocationFound(e) {
                    self.currentLocation = e.latlng;
                    self.locationAvailable = true;
                }

                function clickEvent(e) {
                    self.$emit("update:location", self.roundCoordinates(e.latlng));
                }

                function vertexEdit(e) {
                    self.$emit("update:route", e.poly.getLatLngs())
                }

                if(this.location) {
                    map.setView(new L.LatLng(this.location.lat, this.location.lng), 16);
                }
                else if(this.generalarea) {
                    map.setView(new L.LatLng(this.generalarea.lat, this.generalarea.lng), 16);
                }
               
                map.on('locationfound', onLocationFound);
                map.on('click', clickEvent); 
                map.on('draw:editvertex', vertexEdit);
                
                this.drawWalkingPath();
                this.drawMarker();
                this.drawOtherPoints();

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
