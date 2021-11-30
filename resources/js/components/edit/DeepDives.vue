<template>
    <div>
        <div v-for="(deepdive,key) in stage.deepdives" :key="key" class="m-2">
        <language-text :text="deepdive.title" :languages="languages" :largetext="false">
            Deep Dive Title
        </language-text>
        <language-text :text="deepdive.text" :languages="languages" :largetext="true">
            Deep Dive Text
        </language-text>
        <button @click="removeDeepDive(deepdive, key)" class="btn btn-outline-danger float-right" v-if="deepdive.title"><i class="fas fa-trash"></i> Remove Deep Dive</button>
        </div>
         <button @click="stage.deepdives.push({'title':{'placeholder':null}, 'text':{'placeholder':null}})" class="btn btn-outline-primary"><i class="fas fa-image"></i> Add Deep Dive</button>
    </div>

</template>


<script>

export default {
    props: ["stage", "languages", "tour"],
    created() {
        if (!this.stage.deepdives) {
            this.$set(this.stage, "deepdives",[]);
        }
    },
    methods: {
        removeDeepDive: function(deepdive, key) {
            if(confirm("Are you sure you wish to delete this deep dive?")) {
                this.stage.deepdives.splice(key, 1);
            }

                

        }
    }
}
</script>



