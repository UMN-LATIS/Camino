<template>
 <div>
      <a-scene  v-pre vr-mode-ui="enabled: false" 
                    arjs='sourceType: webcam; sourceWidth:790; sourceHeight:670; displayWidth:790; displayHeight:670; debugUIEnabled: false;'>
             
        <a-text value="Elliot Hall" gps-entity-place="latitude: 44.97691; longitude: -93.23776;" position="0 100 0"
            rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
            width="400">
        </a-text>
                <a-text value="Weisman" gps-entity-place="latitude: 44.97310; longitude: -93.23783;" position="0 200 0"
                    rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
                    width="400">
                </a-text>

        <a-text value="Andersen Library" gps-entity-place="latitude: 44.97322; longitude: -93.24298;" position="0 100 0"
            rotation="0 0 0" font="mozillavr" color="#e43e31" look-at="#camera" side="double" align="center"
            width="200">
        </a-text>
    <a-camera id="camera"
            gps-camera="simulateLatitude: 44.971958; simulateLongitude: -93.2422704; simulateAltitude: 300"
            rotation-reader far=900000>
        </a-camera>
                </a-scene>
     {{ stage }}
 </div>    
</template>

<style scoped>

</style>

<script>
export default {
    props: ["stage"],
    data()  {
        return {
            tour: {},
        }
    },
    mounted() {
        axios.get("/tour.json" + "?" + this.$i18n.locale)
        .then( response => {
            this.tour = response.data

        })
        .catch (error => console.log(error))
        
    }
}
</script>