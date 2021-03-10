<template>
    <div>
         <language-text :text="stage.questionText" :languages="languages" :largetext="true">
            Quiz Question Text
        </language-text>

        <div class="form-group row responseOutline" v-for="(response,index) in stage.responses" :key="index">
          <div class="col-sm-12">
               <language-text :text="response.text" :languages="languages" :largetext="true">
                    Response
                </language-text>
                <input type="checkbox" v-model="response.correct" value="1"> Correct
            </div>
        </div>

        <button @click="addResponse" class="btn btn-outline-primary"><i class="fas fa-plus"></i> Add response</button>

        <div>
           <language-text :text="stage.buttonText" :languages="languages" :largetext="false">
            Button Text
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
                Vue.set(this.stage, "questionText",{"placeholder": null});
                Vue.set(this.stage, "responses", []);
                Vue.set(this.stage, "requireCorrect", 0);
                Vue.set(this.stage, "buttonText", {"placeholder": null, "English": "Check my Answer"});
            }
            
        },
        methods: {
            addResponse: function() {
                this.stage.responses.push({"text":{"placeholder": null}, "correct":0});
            }
        }
    }
</script>