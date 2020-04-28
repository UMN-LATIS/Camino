<template>
    <div>
        <!-- <language-text :text="stage.text" :languages="languages" :largetext="true">
            Feedback Text
        </language-text> -->
       
    </div>

</template>

<script>

export default {
    props: ["stage", "languages", "tour"],
    created() {
        if(!this.stage.text) {
            Vue.set(this.stage, "text", {"placeholder": null});
        }
    }
}
</script>



