<template>
    <div>
        <audio :src="'/storage/' + stage.audio.src" controls v-if="stage.audio.src"></audio>
    </div>
</template>

<style>

</style>
<script>
    export default {
        props: [ "stage", "currentStop"],
        data: function () {
            return {
            };
        },
        methods: {
           
        },
        computed: {
            
        },
        watch: {
  
        }
    };
</script>