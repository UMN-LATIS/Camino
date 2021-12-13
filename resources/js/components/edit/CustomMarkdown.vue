<template>
     <markdown-editor height="150" :value="text" v-on:input="inputUpdated($event)" :id="identifier" :toolbar="toolbar"  :options="options" theme="outline-secondary btn-sm"></markdown-editor>
</template>

<script>
export default {
    props: {
        "text": {

        }, 
        "idkey": {

        }, 
    },
    data() {
        return {
            identifier: "md" + this.idkey,
            options: {
                lineWrapping: true,
                autocorrect: true,
                spellcheck: true,
                autocapitalize: true
            }
        }
    },
    computed: {
        toolbar: function() {
            return "bold italic | numlist bullist quote | link | preview";
            
        }
    },
    methods: {
        inputUpdated: function(value) {
            // markdown editor doesn't override default input events.
            this.$emit('update:text', value);
        }
    },
}
</script>