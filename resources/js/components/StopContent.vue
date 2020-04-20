<template>
    <div class="container mt-2" v-if="tour.stops.length > 0">
        <template v-for="(stage, index) in currentStop.stop_content.stages">
            <div class="row mt-1" :key="index">
                <div class="col">

                    <component :is="stage.type" :stage="stage" :tour="tour" :currentStop="currentStop.stop_content" :currentStopId="currentStopId">
                    </component>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: ["currentStop", "tour", "currentStopId"],
    }

</script>
