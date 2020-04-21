<template>
    <div>
        <language-text :text="stage.text" :languages="languages" :largetext="true">
            Navigation Text
        </language-text>
        <language-text :text="stage.buttonTitle" :languages="languages">
            Map Button Title
        </language-text>

        <div class="form-group row">
          <label for="tourTitle" class="col-sm-2 col-form-label">Location</label>
          <div class="col-sm-6">
              <div v-if="stage.targetPoint">
                  <b>Latitude:</b> {{ stage.targetPoint.lat}}, <b>Longitude:</b> {{ stage.targetPoint.lng}}
                </div>
                <location-selector :location.sync="stage.targetPoint" :generalarea="tour.start_location"></location-selector>
            </div>
        </div>
    </div>

</template>

<style>

.css-icon {
    -webkit-border-radius: 30px;
    height: 10px;
    width: 10px;
    z-index: 10;
}

.target-css-icon {
    border: 3px solid red;
    background-color: red;
}


</style>
<script>

export default {
    props: ["stage", "languages", "tour"],
    created() {
        if(!this.stage.text) {
            Vue.set(this.stage, "text", {"placeholder": null});
            Vue.set(this.stage, "buttonTitle", {"English":"Show Map"});
            Vue.set(this.stage, "targetPoint", null);
        }
    }
}
</script>



