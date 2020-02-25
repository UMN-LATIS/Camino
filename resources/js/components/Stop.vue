<template>
    <div class="bootstrap-fs-modal" v-if="tour">
       <navbar :tour="tour" :currentStop="currentStop" />     
        <stop-content :tour="tour" :currentStop="currentStop"  :key="currentStop" />

    </div>
</template>

<script>
    // // back button for modal
    // $('div.modal').on('show.bs.modal', function () {
    //     var modal = this;
    //     var hash = modal.id;
    //     window.location.hash = hash;
    //     window.onhashchange = function () {
    //         if (!location.hash) {
    //             $(modal).modal('hide');
    //         }
    //     }
    // });

    // $('div.modal').on('hidden.bs.modal', function () {
    //     var hash = this.id;
    //     history.replaceState('', document.title, window.location.pathname);
    // });

    // // when close button clicked simulate back
    // $('div.modal button.close').on('click', function () {
    //     window.history.back();
    // })

    // // when esc pressed when modal open simulate back
    // $('div.modal').keyup(function (e) {
    //     if (e.keyCode == 27) {
    //         window.history.back();
    //     }
    // });

    export default {
        props: [ "currentStop", "status"],
        data() {
            return {
                tour: false
            };
        },
        mounted() {
          axios.get("/tour.json" + "?" + this.$i18n.locale)
            .then( response => {
                this.tour = response.data
                if(this.currentStop == undefined) {
                    this.$router.replace({ "name": "tour", params: {"currentStop": this.tour[0].title}})
                }
            })
            .catch (error => console.log(error))
            
        },
        computed: {
        },
        watch: {
            '$route' (to, from) {
                // todo: scroll to stop
            // react to route changes...
            }
        }
    }

</script>
