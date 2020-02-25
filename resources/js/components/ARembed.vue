<template>
 <div>
      <a-scene v-if="currentStopAR"  vr-mode-ui="enabled: false" 
                    arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false'>



        <a-text value="boopter" gps-entity-place="latitude: -13.253208; longitude: -72.256074;" position="0 1000 0"
            rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
            width="1000">
        </a-text>
                <a-text value="pinky" gps-entity-place="latitude: -13.284595; longitude: -72.229607;"
                    position="0 1000 0"
                    rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
                    width="5000">
                </a-text>

 
        <a-camera id="camera"
            gps-camera="simulateLatitude: -13.2584; simulateLongitude: -72.2643; simulateAltitude: 1000"
            rotation-reader far=900000>
        </a-camera>
                </a-scene>

 </div>    
</template>

<style scoped>

</style>

<script>

export default {
    props: ["stage", "simulateLocation"],
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
            return this.tour.stops.find(elem => elem.title == this.stage);
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