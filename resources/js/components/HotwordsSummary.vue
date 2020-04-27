<template>
    <div v-if="$store.state.hotwords.length > 0">
        <div v-html="formattedText">
        </div>
        <div v-if="stage.request_email" class="row">
            <div class="form-group col-6">
              <label for="email" class="sr-only">E-mail address</label>
              <div class="mb-3">             
              <button type="submit" class="float-right btn btn-primary">Send me a copy</button>
              <input type="email" class="form-control col-9" name="" id="email" placeholder="E-mail address" aria-describedby="emailHelpId" >
              
              </div>
              <small id="emailHelpId" class="form-text text-muted">We promise not to do terrible things with your email</small>
            </div>
           
        </div>
        <div class="card mt-2 mb-2" v-for="(hotwordContent, key) in assembledHotwords" :key="key">
            <div class="card-body">
                <h5 class="card-title">{{ key }}</h5>
                <p class="card-text" v-html="hotwordContent"></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-title {
    text-transform: capitalize;
}
</style>

<script>
    export default {
        props: ["stage", "tour"],
        computed: {
            formattedText: function () {
                return this.marked(this.purify(this.stage.text[this.$i18n.locale]))
            },
            assembledHotwords: function () {

                return Object.keys(this.tour.tour_content.hotWords)
                    .sort()
                    .filter(key => this.$store.state.hotwords.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = this.tour.tour_content.hotWords[key];
                        return obj;
                    }, {});
            }
        }
    }
</script>