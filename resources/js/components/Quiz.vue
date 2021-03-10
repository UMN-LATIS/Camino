<template>
    <div>

        <p>{{ stage.questionText[$i18n.locale] }}</p>
        <div class="form-check" v-for="(response,index) in stage.responses" :key="index">
            <label class="form-check-label">
            <input type="radio" class="form-check-input" :value="response" v-model="selectedAnswer">
            {{ response.text[$i18n.locale] }}
          </label>
        </div>
        <button class="btn btn-outline-primary" @click="checkMyAnswer">{{ stage.buttonText[$i18n.locale] }}</button>
        <save-alert :showAlert.sync="showAlert"><i class="far fa-check-circle answer align-middle" v-if="correct"></i> <i class="far fa-times-circle answer align-middle" v-if="!correct"></i> </save-alert>
    </div>
</template>

<style scoped>
.answer {
    font-size: 1.6em;

}
.answer.fa-check-circle {
    color: green;
}
.answer.fa-times-circle {
    color: red;
}
</style>
<script>
export default {
    props: ["stage", "tour", "currentStopId"],
    data() {
        return {
            selectedAnswer: "",
            showAlert: false,
            correct: false
        }
    },
    computed: {

    },
    methods: {
        checkMyAnswer: function() {
            if(this.selectedAnswer.correct == true) {
                this.correct = true;
                this.showAlert = true;
                this.$store.commit('unlockStop', {"stop": this.currentStopId, "text":this.stage.questionText[this.$i18n.locale]});
            }
            else {
                this.correct = false;
                this.showAlert = true;
            }
        }
    },
    mounted () {
        if(this.stage.requireCorrect) {
            if(!this.$store.state.locks[this.currentStopId] || !this.$store.state.locks[this.currentStopId].find(e=> e.text==this.stage.questionText[this.$i18n.locale])) {
                this.$store.commit('lockStop', {"stop": this.currentStopId, "text": this.stage.questionText[this.$i18n.locale]});
            }
            
        }
    }
}
</script>