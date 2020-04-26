<template>
    <div>
         <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="stage.request_email">
            Request Email Addresses
          </label>
        </div>
        <language-text :text="stage.text" :languages="languages" :largetext="true">
            Hotwords Text
        </language-text>
       
    </div>

</template>

<script>

export default {
    props: ["stage", "languages", "tour"],
    created() {
        if(!this.stage.text) {
            Vue.set(this.stage, "text", {"placeholder": null});
            Vue.set(this.stage, "request_email", true);
        }
    }
}
</script>



