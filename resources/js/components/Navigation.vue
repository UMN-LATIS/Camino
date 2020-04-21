<template>
    <div>
        <hotwords :text="formattedText" >
        </hotwords>
        <button-modal v-if="stage.targetPoint" modalName="nav" :buttonText="stage.buttonTitle[$i18n.locale]" :modalTitle="stage.buttonTitle[$i18n.locale]"
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
                var targetPoints = this.tour.stops.map(stop => stop.stop_content.stages).map(stages=>{
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
