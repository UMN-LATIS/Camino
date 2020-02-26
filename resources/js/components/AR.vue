<template>
    <div>
        <button-modal modalName="ar" :buttonText="$t('stage.ar.showar')"
            :modalTitle="$t('stage.ar.showar')" v-on:modalShown="startAR" v-on:modalClosed="endAR" :disabled="!isMobile">
            <div style="height: 70vh; width: 100%; overflow: hidden" v-if="stage">
               <iframe height="100%" width="100%" frameBorder="0" :src="source"></iframe>
            </div>
        </button-modal>
        <div class="alert alert-primary mt-2" role="alert" v-if="!isMobile">
           {{ $t('stage.ar.warning') }}
        </div>

    </div>
</template>

<script>
    export default {
        props: [ "stage", "currentStop"],
        data() {
            return {
                "closing": false
            }
        },
        mounted() {
            // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
        },
        computed: {
            source: function() {
                if(this.closing) {
                    return "";
                }
                return '/ar/' + this.currentStop.title + '/' + this.$i18n.locale +"/" + this.$store.state.config.simulateLocation;
            },
            isMobile: function() {
                var isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
                return true;
                return isMobile;
            }
        },
        methods: {
            startAR: function(e) {
                this.closing = false;
            },
            endAR: function() {
                this.closing = true;
            }   

        }
    }

</script>
