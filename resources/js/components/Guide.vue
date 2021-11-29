<template>
    <div>{{ formattedText }}</div>

</template>

<script>
export default {
    props: ["stage"],
    computed: {
        formattedText: function() {
            return this.marked(this.purify(this.stage.text[this.$i18n.locale]))
        }
    }
}
</script>