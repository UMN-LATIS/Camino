<template>
    <div class="container mt-2" v-if="tour.length > 0">
        <template v-for="(stage, index) in currentStopData.stages">
            <div class="row" :key="index">
                <div class="col">
                    <component :is="stage.type" :stage="stage" :tour="tour" :currentStop="currentStopData">
                    </component>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: ["currentStop", "tour"],
        computed: {
            currentStopData: function () {
                if (this.tour) {
                    return this.tour.find(elem => elem.title == this.currentStop);
                }
            }
        }
    }

</script>
