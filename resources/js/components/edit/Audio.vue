<template>
    <div>
        <div class="border rounded p-2 m-2" v-if="stage.audio">
            <file-upload v-if="!stage.audio.src" v-on:fileuploaded="audioUploaded($event)" type="Audio File"></file-upload>
            <audio :src="'/storage/' + stage.audio.src" controls v-if="stage.audio.src"></audio>
            <button @click="removeAudio(stage.audio)" class="btn btn-outline-danger float-right" v-if="stage.audio.src"><i class="fas fa-trash"></i> Remove Audio</button>
            
                    
        </div>
    </div>

</template>


<script>
    export default {
        props: ["stage", "languages", "tour"],
        created() {
            if (!this.stage.audio) {
                this.$set(this.stage, "audio",{ src: null});
            }
        },
        methods: {
            audioUploaded: function(value) {
                this.stage.audio.src = value;
            },
            removeImage: function(value) {
                if(confirm("Are you sure you wish to delete this image?")) {
                    axios.delete("/creator/audio/" + value.src)
                    .then(res => {
                        this.stage.audio = {};
                    });
                }

                

            }
        }
    }
</script>