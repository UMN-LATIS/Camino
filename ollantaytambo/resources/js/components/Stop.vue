<template>
    <div class="bootstrap-fs-modal" v-if="tour">
       <navbar :tour="tour" :currentStop="currentStopWithDefault" />     
        <div class="container mt-2" v-if="tour.length > 0">
            <template v-for="(stage, index) in currentStopData.stages" >
                  <div class="row" :key="index">
                    <div class="col">
                        <component  :is="stage.type" :stage="stage" :tour="tour" >
                        </component>
                    </div>
                </div>
            </template>
        </div>
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
        props: [ "currentStop"],
        data() {
            return {
                tour: false
            };
        },
        mounted() {
          axios.get("/tour.json" + "?" + this.$i18n.locale)
            .then( response => {
                this.tour = response.data
            })
            .catch (error => console.log(error))
          
        },
        computed: {
            currentStopWithDefault: function() {
                if(this.currentStop == undefined) {
                    return this.tour[0].title;
                }
                return this.currentStop;
            },
            currentStopData: function() {
                if(this.tour) {
                    return this.tour.find(elem =>  elem.title == this.currentStopWithDefault);
                }
                
            }
        },
        watch: {
            '$route' (to, from) {
                // todo: scroll to stop
            // react to route changes...
            }
        }
    }

</script>
