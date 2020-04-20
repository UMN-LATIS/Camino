<template>
    <div v-if="tour">
        <div v-for="(hotword, key) in hotWords" :key="key">
            {{ hotword }}
            <textarea :value="tour.tour_content.hotWords[hotword]" @input="tour.tour_content.hotWords[hotword] = $event.target.value"></textarea>
        </div>
      <router-link :to="{'name': 'editTour', params: { tourId: tourId }}" class="btn btn-primary">Back to Tour
        </router-link> <button @click="save" class="btn btn-primary">Save</button><save-alert :showAlert.sync="showAlert" />
 
    </div>
 
    
    
</template>

<script>
export default {
    props: ["tourId"],
    data() {
        return {
            tour: null,
            showAlert: false,
        }
    },
    computed: {
        hotWords: function() {
            var foundHotwords = this.tour.stops.map(s => { 
                return s.stop_content.stages.map(stage => {
                        var cleanedMatches = [];
                        Object.entries(stage.text).forEach(([key, value]) => {
                            if(value) {
                                var matches = value.match(/\|(.*?)\|/g);
                                if(matches) {
                                    cleanedMatches.push(matches.map(w=>w.replace(/[\|\|]/g, '')));
                                }
                            }
                        });
                        return cleanedMatches;
                    });
                }).flat(4);

            foundHotwords.forEach((hw) => {
                if(!this.tour.tour_content.hotWords.hasOwnProperty(hw)) {
                    this.tour.tour_content.hotWords[hw] = "";
                }
            });
            return foundHotwords;

        }
    },
    methods: {
        save: function() {
            axios.put("/creator/edit/" + this.tour.id, this.tour)
            .then((res) => {
                this.showAlert = true;
            });
        }
    },
    mounted: function () {
        axios.get("/creator/edit/" + this.tourId)
            .then((res) => {
    
                if(res.data.tour_content.hotWords.length == 0 ) {
                    Vue.set(res.data.tour_content, "hotWords", {});
                }
                this.tour = res.data
            });
        },
}
</script>