<template>
    <div>
        <language-text :text="stage.text" :languages="languages">
            Separator Title
        </language-text>
    </div>

</template>
<script>
export default {
    props: ["stage", "languages"],
    created() {
        if(!this.stage.text) {
            this.$set(this.stage, "text", {"placeholder": null});
        }
    }
}
</script>