<template>
    <div>
        <div v-for="(image,key) in stage.images" :key="key" class="border rounded p-2 m-2">
            <image-upload v-if="!image.src" v-on:imageuploaded="imageUploaded(key, $event)"></image-upload>
            <button @click="stage.images.splice(key,1 )" class="btn btn-outline-danger float-right" v-if="image.src"><i class="fas fa-trash"></i> Remove Image</button>
            <img :src="'/storage/' + image.src" class="img-thumbnail mb-2" v-if="image.src" width="200">
                    <language-text :text="image.text" :languages="languages" :largetext="false">
                        Image Description
                    </language-text>
                    
        </div>
        <button @click="stage.images.push({'src':null, 'text':{'placeholder':null}})" class="btn btn-outline-primary"><i class="fas fa-image"></i> Add image</button>
    </div>

</template>


<script>
    export default {
        props: ["stage", "languages", "tour"],
        created() {
            if (!this.stage.images) {
                Vue.set(this.stage, "images",[]);
            }
        },
        methods: {
            imageUploaded: function(key, value) {
                this.stage.images[key].src = value;
            }
        }
    }
</script>