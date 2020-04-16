<template>
    <div>
        <div v-for="(language, key) in languages" :key="key">
            <label for=""><slot/> ({{ language }})</label>
            
            <input type="text" class="form-control" v-model="text[language]" v-if="!largetext">
            <textarea v-model="text[language]" v-if="largetext"></textarea>
        </div>
    </div>
</template>
<script>
export default {
    props: ["languages", "text", "largetext"]
}
</script>