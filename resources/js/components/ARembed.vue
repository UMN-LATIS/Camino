<template>
 <div style="width:100%; height: 100%">
      <a-scene v-if="currentStopAR"  vr-mode-ui="enabled: false" 
                    arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false'>


        <a-text v-for="(waypoint, index) in currentStopAR.waypoints" :key="index" :value="waypoint.text[locale]" :gps-entity-place="'latitude: ' + waypoint.location.lat + '; longitude: ' + waypoint.location.lng + ';'" 
        :position="'0 ' + waypoint.altitude + ' 0'"
            rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
            width="2000">

        </a-text>
         
 
        <a-camera id="camera" 
            :gps-camera="cameraSettings"
            rotation-reader far=90000>
        </a-camera>
                </a-scene>

 </div>    
</template>

<style scoped>

</style>

<script>

export default {
    props: ["stage", "simulateLocation", "locale"],
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
            return this.tour.stops[this.stage];
        },
        currentStopAR: function() {
            if(!this.currentStop) {
                return false;
            }
            return this.currentStop.stages.find(elem => elem.type =="ar");
        },
        cameraSettings: function() {
            if(this.simulateLocation == "true" && this.tour) {
                return 'simulateLatitude: ' + this.tour.simulatedLatitude +"; simulateLongitude: " + this.tour.simulatedLongitude + "; simulateAltitude: " + this.tour.simulatedAltitude +'';
            }
            else {
                return ""
            }
        }
    },
    mounted() {
        axios.get("/tour.json")
        .then( response => {
            this.tour = response.data
        })
        .catch (error => console.log(error))
        
    }
}
</script>