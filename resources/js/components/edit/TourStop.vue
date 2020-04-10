<template>
    <div>
        <div class="form-group">
            <language-text :languages="languages" :title="title" @change="updated">
                Stop Title
            </language-text>
            
          
          <!-- <location-selection v-model="location" @change="updated"></location-selection> -->
        </div>
        {{ stop }}
    </div>
</template>

<script>
export default {
    props: ["stop", "languages"],
    data() {
        return {
            "title": {},
            "location":{},
            "stages":[]
        }
    },
    methods: {
        updated: function() {
            var stop = {};
            stop.title = this.title;
            stop.location = this.location;
            stop.stages = this.stages;
            this.$emit('update:stop', stop);
        }
    },
    created: function() {
        if(this.stop) {
            this.title = this.stop.title;
            this.location = this.stop.location;
            this.stages = this.stop.stages;
        }
    }
}
</script>