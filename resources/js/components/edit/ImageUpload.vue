<template>
    <div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3" v-if="image">
                            <img :src="image" class="img-responsive" height="70" width="90">
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="custom-file">
                                    <input type="file" ref="file" v-on:change="onImageChange" class="custom-file-input"
                                        id="inputGroupFile02">
                                    <label class="custom-file-label" for="inputGroupFile02"
                                        aria-describedby="inputGroupFileAddon02">Choose an image</label>
                                </div>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-success" id="inputGroupFileAddon02" @click="uploadImage">Upload</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                image: ''
            }
        },
        methods: {
            onImageChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage(file) {
                let reader = new FileReader();
                let vm = this;
                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            uploadImage() {
                let data = new FormData()
                data.append('image', this.$refs.file.files[0])
                axios.post('/creator/image/store', data).then(response => {
                    if (response.data.success) {
                        this.$emit("imageuploaded", response.data.image);
                    }
                });
            }
        }
    }
</script>