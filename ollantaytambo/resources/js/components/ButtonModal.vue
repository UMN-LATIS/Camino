<template>
    <div>
        <b-button v-b-modal.view-modal>{{ buttonText }}</b-button>

        <b-modal size="lg" id="view-modal" :title="modalTitle" ok-only modal-class="modal-fullscreen"
            :ok-title='$t("modalClose")'>
            <slot></slot>
        </b-modal>
    </div>
</template>

<script>
    export default {
        props: ["buttonText", "modalTitle"],
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
                this.$emit("modalShown");
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
                if (from && from.params.status && from.params.status == "view-modal" && !to.params.status || to.params
                    .status !== "view-modal") {
                    this.$bvModal.hide("view-modal")
                }
            }
        }
    }

</script>
