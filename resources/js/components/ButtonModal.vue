<template>
    <div>
        <b-button v-b-modal="randomizedModalName" v-bind:disabled="disabled">{{ buttonText }}</b-button>

        <b-modal size="lg" :id="randomizedModalName" :title="modalTitle" ok-only modal-class="modal-fullscreen"
            ok-title='Close'>
            <slot></slot>
        </b-modal>
    </div>
</template>

<script>
    export default {
        props: ["buttonText", "modalTitle", "modalName", "disabled"],
        data() {
            return {
                randomIdentifier: null
            }
        },
        computed: {
            randomizedModalName: function() {
                return this.modalName + this.randomIdentifier;
            }
        },
        mounted() {
            this.randomIdentifier = Math.round(Math.random() * 100000);
            if (this.$router.currentRoute.params.status !== undefined) {
                this.$router.replace({
                    name: "tour",
                    params: {
                        currentStopId: this.$router.currentRoute.params.currentStopId,
                        status: undefined
                    }
                });
            }

            this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
                if(modalId != this.randomizedModalName) {
                    return;
                }
                this.$emit("modalShown", this.randomizedModalName);
                // console.log('Modal is about to be shown', bvEvent, modalId)
                // console.log(this.$router.currentRoute);
                var hash = modalId;
                this.$router.push({
                    name: 'tour',
                    params: {
                        "currentStopId": this.$router.currentRoute.params.currentStopId,
                        "status": hash
                    }
                })
            })
            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                if(modalId != this.randomizedModalName) {
                    return;
                }
                this.$emit("modalClosed");
                if (bvEvent.trigger != "event") {
                    this.$router.go(-1)
                }

            });
        },
        beforeDestroy() {
            this.$emit("modalClosed");
            this.$root.$off('bv::modal::shown');
            this.$root.$off('bv::modal::hide');
        },
        watch: {
            $route(to, from) {
                if (from && from.params.status && from.params.status == this.randomizedModalName && !to.params.status || to.params
                    .status !== this.randomizedModalName) {
                    this.$bvModal.hide(this.randomizedModalName)
                }
            }
        }
    }

</script>
