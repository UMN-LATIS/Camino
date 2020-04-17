<template>
    <div>
        <div v-for="(image,key) in stage.images" :key="key">
            <image-upload v-if="!image.src" v-on:imageuploaded="imageUploaded(key, $event)"></image-upload>
            <img :src="'/storage/' + image.src" class="img-responsive" v-if="image.src" width="200">
                    <language-text :text="image.text" :languages="languages" :largetext="false">
                        Image Description
                    </language-text>
                    <button @click="stage.images.splice(key)">Remove</button>
        </div>
        <button @click="stage.images.push({'src':null, 'text':{'placeholder':null}})">Add image</button>
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