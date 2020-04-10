<template>
    <div class="">
        <div class="form-group">
          <label for="">Tour Title</label>
          <input type="text"
            class="form-control" v-model="tour.title" placeholder="">
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="tour.public">
            Public
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="tour.active">
            Active
          </label>
        </div>

        <div class="form-group">
          <label for="">Languages</label>
          <div v-for="(language, key) in tour.tour_content.languages" :key="key">
          <input v-model="tour.tour_content.languages[key]" type="text" class="form-control">
          <button @click="tour.tour_content.languages.splice(key, 1)">Remove</button>
          </div>
          <button @click="tour.tour_content.languages.push('')">Add Langauge</button>
        </div>

        <tour-stop v-for="(stop, key) in tour.tour_content.stops" :key=key :stop.sync="tour.tour_content.stops[key]" :languages="tour.tour_content.languages"></tour-stop>
        <button @click="tour.tour_content.stops.push('')">Add Stop</button>

    <button @click="save">Save</button>
   edit
   {{ tour.tour_content }}
    </div>
</template>

<script>
   

    export default {
        props: ["tourId"],
        data() {
            return {
                tour: {
                    public: false,
                    active: false,
                    title: "",
                    tour_content: {
                        languages: ["English"],
                        stops: []
                    }
                    
                }
            }
        },
        methods: {
            save: function() {
                if(!this.tour.id) {
                    axios.post("/edit/edit", this.tour)
                    .then((res) => {
                        this.$router.replace("/edit/" + res.data.id);
                    });
                }
                else {
                    axios.put("/edit/edit/" + this.tour.id, this.tour)
                    .then((res) => {
                        // todo: update info
                    });
                }
            }
        },
        mounted: function() {
            if(this.tourId) {
                axios.get("/edit/edit/" + this.tourId )
                .then((res) => {
                    this.tour = res.data
                });
            }
            
        }
    }

</script>
