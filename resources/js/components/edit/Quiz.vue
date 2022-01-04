<template>
    <div>
         <language-text :text="stage.questionText" :languages="languages" :largetext="true">
            Quiz Question Text
        </language-text>

  
        <div class="form-group row">
            <label for="quizType" class="col-sm-1"><b>Quiz Type</b></label>
            <div class="col-sm-6 ">
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="radio" name="quizType" class="form-check-input" v-model="stage.quizType" value="multiple_choice">
                        Multiple Choice
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="radio" name="quizType" class="form-check-input" v-model="stage.quizType" value="free_text">
                        Free Text
                    </label>
                </div>
            </div>
        </div>

        <div class="form-group row responseOutline" v-for="(response,index) in stage.responses" :key="index">
          <div class="col-sm-12 mt-2">
               <language-text :text="response.text" :languages="languages" :largetext="isMultipleChoice">
                    Response
                </language-text>
                <span v-if="isMultipleChoice">
                <input type="checkbox" v-model="response.correct" value="1" > Correct
                </span>
            </div>
        </div>

        <button @click="addResponse" class="btn btn-outline-primary"><i class="fas fa-plus"></i> Add response</button>

        <language-text :text="stage.hintText" :languages="languages" :largetext="true">
            Hint
        </language-text>

        <div>
           <language-text :text="stage.buttonText" :languages="languages" :largetext="false">
            Button Text
            </language-text>
        </div>
        <div v-if="!isMultipleChoice">
           <language-text :text="stage.answerPrompt" :languages="languages" :largetext="false">
            Answer Prompt
            </language-text>
        </div>
        <div >
           <language-text :text="stage.hintPrompt" :languages="languages" :largetext="false">
            Hint Prompt
            </language-text>
        </div>
        <div>
            <input type="checkbox" v-model="stage.requireCorrect" value="1" /> Require Correct Answer to Advance
        </div>
    </div>

</template>

<style scoped>
.responseOutline {
    border:  1px solid lightgray;
    border-radius: 3px;;
}
</style>
<script>
    export default {
        props: ["stage", "languages", "tour"],
        created() {
            if (!this.stage.questionText) {
                this.$set(this.stage, "questionText",{"placeholder": null});
                this.$set(this.stage, "hintText",{"placeholder": null});
                this.$set(this.stage, "quizType","multiple_choice");
                this.$set(this.stage, "responses", []);
                this.$set(this.stage, "requireCorrect", 0);
                this.$set(this.stage, "buttonText", {"placeholder": null, "en": "Check my Answer"});
                this.$set(this.stage, "answerPrompt", {"placeholder": null, "en": "Answer"});
                this.$set(this.stage, "hintPrompt", {"placeholder": null, "en": "Show Hint"});
            }
            
        },
        computed: {
            isMultipleChoice: function() {
                return this.stage.quizType == "multiple_choice";
            }
        },
        methods: {
            addResponse: function() {
                this.stage.responses.push({"text":{"placeholder": null}, "correct":0});
            }
        }
    }
</script>