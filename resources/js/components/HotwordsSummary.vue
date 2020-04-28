<template>
    <div v-if="$store.state.hotwords.length > 0 && assembledHotwords > 0">
        <div v-html="formattedText">
        </div>

        <div class="form-inline">
            <label for="email" class="sr-only">E-mail address</label>
            <input type="email" class="form-control mr-2 col-7 col-md-3" name="" v-model="email" id="email"
                placeholder="E-mail address" aria-describedby="emailHelpId">
            <button type="submit" class="btn btn-primary" @click="sendHotwords"
                :disabled="success">{{ $t("stage.hotwords.email") }}</button>
            <i class="fas fa-check-circle ml-2" v-if="success"></i>
        </div>
        <small id="emailHelpId" class="form-text text-muted">{{ $t("stage.hotwords.disclaimer") }}</small>
        <div class="card mt-2 mb-2" v-for="(hotwordContent, key) in assembledHotwords" :key="key">
            <div class="card-body">
                <h5 class="card-title">{{ key }}</h5>
                <p class="card-text" v-html="hotwordContent"></p>
            </div>
        </div>
    </div>
    <div v-else>
        <p>{{ $t("stage.hotwords.none") }}</p>
    </div>
</template>

<style scoped>
    .card-title {
        text-transform: capitalize;
    }

    .form-inline .form-control {
        display: inline-block !important;
        width: auto !important
    }

    .fa-check-circle {
        color: green;
        font-size: 1.4em;
    }
</style>

<script>
    export default {
        props: ["stage", "tour"],
        data() {
            return {
                "email": null,
                "success": false
            }
        },
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
        },
        methods: {
            sendHotwords: function () {
                axios.post("/emailHotwords", {
                        email: this.email,
                        hotwords: this.assembledHotwords
                    })
                    .then(res => {
                        this.success = true;
                    });
            }
        }
    }
</script>