<template>
 <div style="width:100%; height: 100%">
      <a-scene v-if="currentStopAR"  vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: true"
                    arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false'>


        <a-text v-for="(waypoint, index) in currentStopAR.waypoints" :key="index" 
            :value="waypoint.text[locale]" :gps-entity-place="'latitude: ' +  waypoint.location.lat  + '; longitude: ' + waypoint.location.lng + ';'" 
            :position="'0 ' + (waypoint.altitude?waypoint.altitude:0) + ' 0'" 
            rotation="0 0 0" 
            font="roboto" 
            color="#e43e31" 
            look-at="#camera" 
            side="double" 
            align="center" 
            :z-offset="getDistanceFromWaypoint(waypoint) * .1"
            :geometry="'primitive: plane; width: ' + getTextWidth(waypoint)  + '; height: ' + getTextHeight(waypoint)" material="color: #eee; opacity: 0.6; transparent: true"
            :width="getSizeForPoint(waypoint)">

        </a-text>
         
 
        <a-camera id="camera" 
            :gps-camera="cameraSettings"
            rotation-reader maxDistance=10000 far=90000>
        </a-camera>
                </a-scene>

 </div>    
</template>

<style scoped>

</style>

<script>

export default {
    props: ["stage", "simulateLocation", "locale", "tourId"],
    data()  {
        return {
            tour: null,
        }
    },
    computed: {
        currentStop: function() {
            if(!this.tour) {
                return false;
            }
            return this.tour.stops[this.stage].stop_content;
        },
        currentStopAR: function() {
            if(!this.currentStop) {
                return false;
            }
            return this.currentStop.stages.find(elem => elem.type =="ar");
        },
        
        cameraSettings: function() {
            if(this.simulateLocation == "true" && this.tour) {
                var currentStopLocation = this.currentStop.stages.find(elem => elem.type =="navigation");
                var startLocation = this.tour.start_location;
                if(currentStopLocation) {
                    startLocation = currentStopLocation.targetPoint;
                }
                
                return 'simulateLatitude: ' + startLocation.lat +"; simulateLongitude: " + startLocation.lng + "; simulateAltitude: " + 0 +'';
            }
            else {
                return ""
            }
        }
    },
    methods: {
        getTextWidth(waypoint) {
            return this.getSizeForPoint(waypoint) / 1.5;
        },
        getTextHeight(waypoint) {
            var distance = this.getDistanceFromWaypoint(waypoint);
            return Math.pow(Math.log(distance), 2) * 1.5
        },
        getDistanceFromWaypoint(waypoint) {
            var nav = this.currentStop.stages.find(elem => elem.type =="navigation");
            if(!nav) {
                return 2000;
            }
            var stageLocation = nav.targetPoint;

            var a = waypoint.location.lat - stageLocation.lat;
            var b = waypoint.location.lng - stageLocation.lng;
            var distance = Math.sqrt( a*a + b*b ) * 111139; //meters per degree
            return distance;
        },
        getScaledDistanceFromWaypoint(waypoint) {
            return (Math.pow(Math.log(this.getDistanceFromWaypoint(waypoint)), 2));
        },
        getSizeForPoint(waypoint) {
            var scaledDistance = this.getScaledDistanceFromWaypoint(waypoint);
            return scaledDistance *  waypoint.text[this.locale].length;
        }
    },
    mounted() {
        axios.get("/api/tour/" + this.tourId)
        .then( response => {
            this.tour = response.data
        })
        .catch (error => console.log(error))
        
    }
}
</script>