<template>
    <div>
        <div class="row d-flex justify-content-between align-items-center">
            <h1>My Tours</h1>
            <div>
                <router-link :to='{name: "createTour"}' class="btn btn-primary"><i class="fas fa-plus"></i> Create a New Tour</router-link>
            </div>
        </div>
        <div class="card mt-2" v-for="tour in sortedTitles" :key="tour.id">
            <div class="card-body d-flex justify-content-between align-items-center">
                <h5 class="card-title">{{ tour.title }}</h5> 
                <div class="controls">
                    <a href="#" @click="deleteTour(tour.id)" class="btn btn-outline-danger">Delete <i class="fas fa-trash"></i></a>
                    <a :href="'/tour/' + tour.id" class="btn btn-outline-success" target="_blank">Preview <i class="fas fa-eye"></i></a>
                    <router-link :to='{name: "editTour", params: { tourId: tour.id }}' class="btn btn-outline-primary">Edit <i class="fas fa-edit"></i></router-link>
                    
                </div>
            </div>
        </div>
        
    
    </div>
</template>

<style scoped>
.card-title {
    margin-bottom: 0px;
}
</style>

<script>
   

    export default {
        data() {
            return {
                tours: []
            }
        },
        computed: {
            sortedTitles: function() {
                return this.tours.sort((a,b)=>(a.title > b.title) ? 1:-1)
            }
        },
        methods: {
            deleteTour: function(tour) {
                if(confirm("Are you sure you wish to delete this tour?")) {
                    axios.delete("/creator/edit/" + tour)
                    .then((res) => {
                        this.loadTours();
                    });
                }
            },
            loadTours: function() {
                axios.get("/creator?" + Math.random()) // someday do .json routes in laravel
                .then((res) => {
                    this.tours = res.data
                });
            }
        },
        mounted: function() {
            this.loadTours();
        }
    }

</script>
