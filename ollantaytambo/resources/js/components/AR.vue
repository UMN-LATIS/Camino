<template>
    <div>
        <button-modal modalName="ar" :buttonText="$t('stage.navigation.showmap')"
            :modalTitle="$t('stage.navigation.title')" v-on:modalShown="startAR" v-on:modalClosed="endAR">
            <div style="height: 70vh; width: 100%; overflow: hidden" v-if="stage">
               <iframe height="100%" width="100%" frameBorder="0" :src="'/ar/' + currentStop.title"></iframe>
            </div>
        </button-modal>
    </div>
</template>

<script>
    export default {
        props: [ "stage", "currentStop"],
        mounted() {
            // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
        },
        methods: {
            startAR: function(e) {
            },
            endAR: function() {

            }

        }
    }

</script>
