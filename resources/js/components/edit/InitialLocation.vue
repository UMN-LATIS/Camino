<template>
    <div>
        <p>General location for tour: {{ location }}</p>
        
        <location-selector :location.sync="location" :basemap="basemap"></location-selector>
    </div>
</template>


<script>

    export default {
        props: ["location", "basemap"]
    }

</script>
