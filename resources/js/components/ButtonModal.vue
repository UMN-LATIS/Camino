<template>
    <div>
        <b-button v-b-modal="modalName">{{ buttonText }}</b-button>

        <b-modal size="lg" :id="modalName" :title="modalTitle" ok-only modal-class="modal-fullscreen"
            :ok-title='$t("modalClose")'>
            <slot></slot>
        </b-modal>
    </div>
</template>

<script>
    export default {
        props: ["buttonText", "modalTitle", "modalName"],
        mounted() {
            if (this.$router.currentRoute.params.status !== undefined) {
                this.$router.replace({
                    name: "tour",
                    params: {
                        currentStop: this.$router.currentRoute.params.currentStop,
                        status: undefined
                    }
                });
            }

            this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
                if(modalId != this.modalName) {
                    return;
                }
                this.$emit("modalShown", this.modalName);
                // console.log('Modal is about to be shown', bvEvent, modalId)
                // console.log(this.$router.currentRoute);
                var hash = modalId;
                this.$router.push({
                    name: 'tour',
                    params: {
                        "currentStop": this.$router.currentRoute.params.currentStop,
                        "status": hash
                    }
                })
            })
            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                if(modalId != this.modalName) {
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
                if (from && from.params.status && from.params.status == this.modalName && !to.params.status || to.params
                    .status !== this.modalName) {
                    this.$bvModal.hide(this.modalName)
                }
            }
        }
    }

</script>
