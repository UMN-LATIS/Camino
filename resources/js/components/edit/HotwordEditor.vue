<template>
    <div v-if="tour">
        <div v-for="(language, key) in hotWords" :key="key">
            {{ key }}
            <div v-for="(hotword, hwkey) in language" :key="hwkey">
            {{ hotword }}
            <textarea :value="tour.tour_content.hotWords[hotword]" @input="tour.tour_content.hotWords[hotword] = $event.target.value"></textarea>
            </div>
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
            // walk the tour and find all of the hotwords
            var foundHotwords = this.tour.stops.map(s => { 
                return s.stop_content.stages.map(stage => {
                        var cleanedMatches = [];
                        Object.entries(stage.text).forEach(([key, value]) => {
                            if(value) {
                                var matches = value.match(/\|(.*?)\|/g);
                                if(matches) {
                                    cleanedMatches.push({[key]: matches.map(w=>w.replace(/[\|\|]/g, ''))});
                                }
                            }
                        });
                        return cleanedMatches;
                    });
                }).flat(4);
            // group the hotwords by langauge and de-dupe
            var groupedHotwords = foundHotwords.reduce((r, a) => {
                    var key = Object.keys(a)[0];
                    var entries = Object.values(a)[0];
                    // use a new set and spread to de-dupe the two arrays
                    r[key] = [...new Set([ ...(r[key] || []) ,...entries])];
                    return r;
                }, {})

            // if there are hotwords that aren't already in the tour, create them.
            
            Object.values(groupedHotwords).forEach((hw) => {
                if(!this.tour.tour_content.hotWords.hasOwnProperty(hw)) {
                    this.tour.tour_content.hotWords[hw] = "";
                }
            });
            return groupedHotwords;

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