<template>
    <div>
        <language-text :text="stage.buttonTitle" :languages="languages">
            AR Button Title
        </language-text>
        <p>Waypoints:</p>

        <div v-for="(waypoint, key) in stage.waypoints" :key="key">
            Location: <location-selector :location.sync="waypoint.location" :generalarea="tour.start_location"></location-selector>
            <language-text :text="waypoint.text" :languages="languages">
            Text
            </language-text>
            Altitude (optional): <input v-model="waypoint.altitude" />
        </div>
        <button @click="stage.waypoints.push({'location':null, 'text':{'placeholder':null}, 'altitude':null})">Add waypoint</button>
    </div>

</template>



<script>

export default {
    props: ["stage", "languages", "tour"],
    created() {
        if(!this.stage.text && !this.stage.waypoints) {
            Vue.set(this.stage, "text", {"placeholder": null});
            Vue.set(this.stage, "buttonTitle", {"English":"Show AR"});
            Vue.set(this.stage, "waypoints", []);
        }
    }
}
</script>



