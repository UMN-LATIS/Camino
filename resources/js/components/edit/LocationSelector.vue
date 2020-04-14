<template>
    <div>
        <p>General location for tour: {{ location }}</p>
        
        <b-button v-b-modal="randomizedModalName">Set Location</b-button>
        
        <b-modal size="lg" :id="randomizedModalName" title="Set Location" ok-only modal-class="modal-fullscreen"
            ok-title='Close'>
            
            <div style="height: 70vh; width: 100%" id="map">


            </div>
            <template v-slot:modal-footer="{ ok }" :locationAvailable="locationAvailable">
                <div class="w-100">
      <!-- Emulate built in modal footer ok and cancel button actions -->
      <b-button @click="useCurrentLocation" v-bind:disabled="!locationAvailable" class="float-left">Use Current Location</b-button>

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

    export default {
        props: ["location"],
        data() {
            return {
                currentLocation: null,
                locationAvailable: false,
                randomizedModalName: "navModal"
            }
        },
        mounted() {
            this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
                this.renderMap();
            })
             this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
                this.destroyMap();
            })            
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
            }
        },
        methods: {
            useCurrentLocation: function() {
                this.$emit("update:location", this.currentLocation);
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
            renderMap: function () {

                console.log("nav");

                map = L.map('map').fitWorld();
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
             

                var self = this;
               

                function onLocationFound(e) {
                    self.currentLocation = e.latlng;
                    self.locationAvailable = true;
                    
                }

                function clickEvent(e) {
                    self.$emit("update:location", e.latlng);
                }

                if(this.location) {
                    marker = L.marker([this.location.lat, this.location.lng], {
                        icon: targetLocationCssIcon
                    });
                    marker.addTo(map);
                    map.setView(new L.LatLng(this.location.lat, this.location.lng), 17);

                }
               
                map.on('locationfound', onLocationFound);
                map.on('click', clickEvent); 
                lc = L.control.locate({
                    showCompass: true,
                    locateOptions: {
                        enableHighAccuracy: true,
                        maxZoom: 18
                    }
                }).addTo(map);

            }
        },

    }

</script>
