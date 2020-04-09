<template>
    <div class="">
        <ul>
            <li v-for="tour in tours" :key="tour.id">
                <router-link :to='{name: "editTour", params: { tourId: tour.id }}'>Edit Tour</router-link>
            </li>
        </ul>
    {{ tours }}
    <router-link :to='{name: "createTour"}'>create tour</router-link>
    </div>
</template>

<script>
   

    export default {
        data() {
            return {
                tours: []
            }
        },
        mounted: function() {
            axios.get("/edit?" + Math.random()) // someday do .json routes in laravel
            .then((res) => {
                this.tours = res.data
            });
        }
    }

</script>
