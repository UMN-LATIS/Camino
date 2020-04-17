<template>
    <div>
        <language-text :text="stage.text" :languages="languages" :largetext="true">
            Guide Text
        </language-text>

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
        }
    }
}
</script>



