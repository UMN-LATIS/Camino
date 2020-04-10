<template>
    <div>
        <div class="form-group">
            <language-text :languages="languages" :text.sync="stop.title">
                Stop Title
            </language-text>
            
            <stage v-for="(stage,key) in stop.stages" :key='key' :stage="stage">
                
                <seperator :stage="stage" :languages="languages"></seperator>
            
            </stage>

          <!-- <location-selection v-model="location" @change="updated"></location-selection> -->
        </div>
        <!-- {{ stop }} -->
    </div>
</template>

<script>
export default {
    props: ["stop", "languages"],
    data() {
        return {
            // "title": {},
            // "location":{},
            // "stages":[]
        }
    },
    methods: {
        updated: function() {
            // var stop = {};
            // stop.title = this.title;
            // stop.location = this.location;
            // stop.stages = this.stages;
            // this.$emit('update:stop', stop);
        }
    },
    created: function() {
        if(!this.stop.title) {
            Vue.set(this.stop, "title", {});
            Vue.set(this.stop, "stages", []);
        }
    }
}
</script>