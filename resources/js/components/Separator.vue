<template>
    <div>
        <hr class="separator-bar"/>
        <span class="font-weight-light"> {{ this.stage.text[$i18n.locale]}} </span>
    </div>
</template>

<style scoped lang="scss">
// @import "../../sass/_variables.scss";
span {
    font-size: 1.5em;
}
</style>

<script>
export default {
    props: ["stage"]
}
</script>