<template>
    <div>
        <div v-for="(language, key) in languages" :key="key">
            <label for=""><slot/> ({{ language }})</label>
            
            <input type="text" class="form-control" v-model="text[language]" v-if="!largetext">
            <custom-markdown v-if="largetext" :text.sync="text[language]" :idkey="key + randomIdentifier"></custom-markdown>
            
        </div>
    </div>
</template>
<script>
export default {
    props: ["languages", "text", "largetext"],
    data() {
        return {
            randomIdentifier: (Math.round(Math.random() * 10000)).toString()
        }
    }
}
</script>