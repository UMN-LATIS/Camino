<template>
    <div class="mt-2">
        <CoolLightBox :items="items" :index="index" @close="index = null">
        </CoolLightBox>

        <div class="images-wrapper">
            <div class="image-wrapper" v-for="(image, imageIndex) in items" :key="imageIndex">
            <div class="image"  @click="index = imageIndex"
                :style="{ backgroundImage: 'url(' + image.src + ')' }"></div>
                </div>
        </div>
    </div>
</template>

<style scoped>
.images-wrapper {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-right:-10px;
}


img, input, select {
    vertical-align:middle
}



@media (min-width: 767px) {
    .images-wrapper {
        margin-right:-20px
    }
}

.images-wrapper .image-wrapper {
    margin-bottom: 10px;
    width: calc(50% - 10px);
    margin-right:10px
}

@media (min-width: 767px) {
    .images-wrapper .image-wrapper {
        margin-bottom: 20px;
        width: calc(16.66667% - 20px);
        margin-right:20px
    }
}

.images-wrapper .image-wrapper .image {
    cursor: pointer;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    padding-top:100%
}

</style>
<script>
    export default {
        props: [ "stage", "currentStop"],
        data: function () {
            return {
                
                index: null
            };
        },
        computed: {
            items: function() {
                return this.stage.images.map(i => { return {"title": i.title[this.$i18n.locale], "description": i.description[this.$i18n.locale], "src": "/images/" + i.image }});
            }
        }
    };
</script>