<template>
    <div>
        <CoolLightBox ref="lightbox" :items="items" :index="index" @close="index = null; close()" @on-open="open()" :slideshow="false" :gallery="false" >
            <close
        </CoolLightBox>

        <div class="images-wrapper">
            <div class="image-wrapper" v-for="(image, imageIndex) in items" :key="imageIndex">
            <div class="image"  @click="index = imageIndex"
                :style="{ backgroundImage: 'url(' + image.src + ')' }"></div>
                </div>
        </div>
    </div>
</template>

<style>
.cool-lightbox-toolbar .cool-lightbox-toolbar__btn {
    width: 55px !important;
    height: 55px !important;
}
</style>

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
                index: null,
                modalName: "gallery"
            };
        },
        methods: {
            close: function() {
                if(this.$router.currentRoute.params.status == this.modalName) {
                    this.$router.go(-1);
                }
            },
            open: function() {
                this.$router.push({
                    name: 'tour',
                    params: {
                        "currentStopId": this.$router.currentRoute.params.currentStopId,
                        "status": this.modalName
                    }
                })
            }
        },
        computed: {
            items: function() {
                return this.stage.images.map(i => { return {"title": i.title[this.$i18n.locale], "description": i.description[this.$i18n.locale], "src": "/images/" + i.image }});
            }
        },
        watch: {
            $route(to, from) {
                if (from && from.params.status && from.params.status == this.modalName && !to.params.status || to.params
                    .status !== this.modalName) {
                    this.$refs.lightbox.close();
                }
            }
        }
    };
</script>