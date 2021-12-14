<template>
    <div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 fa-3x" v-if="file">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="custom-file">
                                    <input type="file" ref="file" v-on:change="onFileChange" class="custom-file-input"
                                        id="inputGroupFile02" @change="uploadFile">
                                    <label class="custom-file-label" for="inputGroupFile02"
                                        aria-describedby="inputGroupFileAddon02">Select {{ type }}</label>
                                </div>
                                <!-- <div class="input-group-append">
                                    <button class="btn btn-outline-success" id="inputGroupFileAddon02" @click="uploadImage">Upload</button>
                                </div> -->
                            </div>
                        </div>

                    </div>
                   <div class="row alert alert-danger mt-2" role="alert" v-if="errorText">
                        <strong>Error: </strong> {{ errorText }}
                    </div>
                </div>
                 
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["type"],
        data() {
            return {
                file: '',
                errorText: null
            }
        },
        methods: {
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createFile(files[0]);
            },
            createFile(file) {
                let reader = new FileReader();
                let vm = this;
                reader.onload = (e) => {
                    vm.file = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            uploadFile() {
                let data = new FormData()
                this.errorText = null;
                data.append('upload', this.$refs.file.files[0])
                axios.post('/creator/file/store', data).then(response => {
                    if (response.data.success) {
                        this.$emit("fileuploaded", response.data.file);    
                        
                    }
    console.log(response);
                })
                .catch((error) => {

                    this.errorText = error.response.data.error.file;
                });
            }
        }
    }
</script>