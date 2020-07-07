<template>
    <div>
        <error :error="error"/>
        <div class="row d-flex justify-content-between align-items-center">
            <h1>My Tours</h1>
            <div>
                <router-link :to='{name: "createTour"}' class="btn btn-primary"><i class="fas fa-plus"></i> Create a New Tour</router-link>
            </div>
        </div>
        
        <div class="card mt-2" v-for="tour in sortedTitles" :key="tour.id">
            <div class="card-body d-flex justify-content-between align-items-center flex-wrap">
                <h5 class="card-title"><i class="fas fa-check-circle mr-2" v-if="tour.active"></i><i class="fas fa-globe mr-2" v-if="tour.public"></i><transport-icon :tour="tour" class="mr-2" />{{ tour.title }}</h5> 
                <div class="controls pt-2 pt-sm-0">
                    <router-link :to='{name: "tourFeedback", params: { tourId: tour.id }}' class="btn btn-outline-info"><i class="fas fa-comment"></i> <span class="d-none d-sm-inline">Feedback</span></router-link>
                    <a href="#" @click="deleteTour(tour.id)" class="btn btn-outline-danger"><i class="fas fa-trash"></i> <span class="d-none d-sm-inline">Delete</span></a>
                    <a :href="'/tour/' + tour.id" class="btn btn-outline-success" target="_blank"><i class="fas fa-eye"></i> <span class="d-none d-sm-inline">Preview</span></a>
                    <router-link :to='{name: "editTour", params: { tourId: tour.id }}' class="btn btn-outline-primary"><i class="fas fa-edit"></i> <span class="d-none d-sm-inline">Edit</span></router-link>
                    
                </div>
            </div>
        </div>
        
    
    </div>
</template>

<style scoped>
.card-title {
    margin-bottom: 0px;
}
.fa-check-circle {  
    color: green;
  }
.fa-globe  {
    color: darkblue;
}
.controls {
    white-space: nowrap;
}

</style>

<style >
.ck-editor__editable:not(.ck-editor__nested-editable) { 
    min-height: 150px;
}
</style>

<script>
   

    export default {
        data() {
            return {
                tours: [],
                error: null
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
                    }).catch(res => {
                    this.error = res;
                    });
                }
            },
            loadTours: function() {
                axios.get("/creator?" + Math.random()) // someday do .json routes in laravel
                .then((res) => {
                    this.tours = res.data
                    document.title = "Camino: My Tours";
                })
                .catch(res => {
                    this.error = res;
                });
            }
        },
        mounted: function() {
            this.loadTours();
        }
    }

</script>
