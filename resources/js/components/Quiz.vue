<template>
    <div>

        <p>{{ stage.questionText[$i18n.locale] }}</p>

        <div v-if="stage.quizType == 'multiple_choice'">
            <div class="form-check" v-for="(response,index) in stage.responses" :key="index" >
                <label class="form-check-label">
                <input type="radio" class="form-check-input" :value="response" v-model="selectedAnswer">
                {{ response.text[$i18n.locale] }}
            </label>
            </div>
        </div>
        <div v-else>
            <div class="form-group">
              <label for="">{{ stage.answerPrompt[$i18n.locale] }}</label>
              <input type="text" class="form-control" name="quiz_answer" v-model="selectedAnswer">
            </div>
        </div>

        <p v-if="showHint">
            {{ stage.hintText[$i18n.locale]}}
        </p>
        <button class="btn btn-outline-primary" @click="showHint=true">{{ stage.hintPrompt[$i18n.locale] }}</button>
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
            correct: false,
            showHint: false
        }
    },
    computed: {

    },
    methods: {
        checkMyAnswer: function() {
            if(this.stage.quizType == 'multiple_choice') {
                if(this.selectedAnswer.correct == true) {
                    this.correct = true;
                    
                }
                else {
                    this.correct = false;
                    
                }
            }
            else if(this.stage.quizType == 'free_text') {

                if(this.stage.responses.filter(r => r.text[this.$i18n.locale].toLowerCase().trim() == this.selectedAnswer.toLowerCase().trim()).length > 0) {
                    this.correct = true;
                }
                else {
                    this.correct=false;
                }
            }
            
            if(this.correct) {
                this.showAlert = true;
                this.$store.commit('unlockStop', {"stop": this.currentStopId, "text":this.stage.questionText[this.$i18n.locale]});
            }
            else {
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