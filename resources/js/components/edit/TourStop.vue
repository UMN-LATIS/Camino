<template>
    <div>
        <button v-if="stackLength > 1" class="btn btn-primary" @click="goBack">Go Back</button>

        <div v-if="tour">
            <language-text :languages="tour.tour_content.languages" :text.sync="stop.stop_content.title">
                Stop Title
            </language-text>
            
            <stage v-for="(stage,key) in stop.stop_content.stages" :key='key' :stage="stage" v-on:remove="stop.stop_content.stages.splice(key)">
                <component :is="stage.type" :stage="stage" :languages="tour.tour_content.languages" :tour="tour"></component>
            </stage>

            <div class="form-group">
                <div class="row">
                  <label class="col-2 col-form-label text-right" for="">New Stage Type</label>
                  <select class="form-control col-2" v-model="newStageType">
                      <option disabled></option>
                    <option v-for="(stageType, key) in stageTypes" :key="key">{{ stageType }}</option>
                  </select>
                    <div class="col-2">
                        <button class="btn btn-primary" @click="addStage">Add Stage</button>
                    </div>
                </div>
            </div>


        </div>
        <button @click="save" class="btn btn-primary">Save</button>
        <!-- {{ stop }} -->
    </div>
</template>

<script>
export default {
    props: ["stopId", "tourId"],
    data() {
        return {
            newStageType: null,
            stageTypes: ["Seperator", "AR", "Embed", "Guide", "Gallery", "Navigation"],
            tour: null,
            "stackLength": window.history.length,
            stop: {
                stop_content: {
                    "title": {},
                    "stages": []
                }
            }
        }
    },
    methods: {
        addStage: function() {
            this.stop.stop_content.stages.push({"type": this.newStageType.toLowerCase()});
        },
        goBack: function() {
            this.$router.go(-1);
        },
        save: function() {

            if(!this.stop.id) {
                axios.post("/creator/edit/" + this.tour.id + "/stop/" , this.stop)
                .then((res) => {
                    this.stop.id = res.data.id;
                    this.$router.replace({ name: 'editStop', params: { tourId: this.tourId, stopId: this.stop.id }})
                    this.savedAlert()
                });
            }
            else {
                axios.put("/creator/edit/" + this.tour.id + "/stop/" + this.stop.id , this.stop)
                .then((res) => {
                    
                    this.savedAlert()
                });
            }
        },
        savedAlert: function() {
            this.$bvToast.toast('Stop saved', {
                title: `Saved`,
                variant: "success",
                autoHideDelay: 3000,
                solid: true
            })
        }
    },
    mounted: function() {
        axios.get("/creator/edit/" + this.tourId )
        .then((res) => {
            this.tour = res.data
            if(this.stopId) {
                this.stop = this.tour.stops.find(s => s.id == this.stopId);
            }
        });
        

    },
    // created: function() {
    //     if(!this.stop.title) {
    //         Vue.set(this.stop, "title", {});
    //         Vue.set(this.stop, "stages", []);
    //     }
    // }
}
</script>