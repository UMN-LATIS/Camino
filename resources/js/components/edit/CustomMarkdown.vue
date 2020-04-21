<template>
     <markdown-editor height="150" :value="text" v-on:input="inputUpdated($event)" :id="identifier" :toolbar="toolbar" :extend="custom" theme="outline-secondary btn-sm"></markdown-editor>
</template>

<script>
export default {
    props: {
        "text": {

        }, 
        "idkey": {

        }, 
        "allowHotwords": {
            default: true
        }
    },
    data() {
        return {
            identifier: "md" + this.idkey,
            custom: {
                'hotword': {
                    cmd: 'hotword',
                    ico: 'fas fa-fire',
                    title: 'Mark as hotword'
                }
            }
        }
    },
    computed: {
        toolbar: function() {
            if(this.allowHotwords) {
                return "bold italic | numlist bullist quote | link hotword | preview";
            }
            else {
                return "bold italic | numlist bullist quote | link | preview";
            }
            
        }
    },
    methods: {
        inputUpdated: function(value) {
            // markdown editor doesn't override default input events.
            this.$emit('update:text', value);
        }
    },
    created() {
        this.$root.$on('markdown-editor:hotword',  (md) => {
            if(md.id == this.identifier) {
                var text = md.editor.getSelection();
                md.editor.replaceSelection("|" + text + "|");
            }
            
        });
    }
}
</script>