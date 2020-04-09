<template>
    <div class="">
   edit
   {{ tour.tour_content }}
    </div>
</template>

<script>
   

    export default {
        props: ["tourId"],
        data() {
            return {
                tour: []
            }
        },
        mounted: function() {
            if(this.tourId) {
                axios.get("/edit/" + this.tourId )
                .then((res) => {
                    this.tour = res.data
                });
            }
            
        }
    }

</script>
