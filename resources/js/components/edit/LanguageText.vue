<template>
    <div>
        <div v-for="(language, key) in languages" :key="key">
            <label for=""><slot/> ({{ language }})</label>
            <input type="text" class="form-control" v-model="title[language]" @keyup="$emit('updated', localTitle)">
        </div>
    </div>
</template>
<script>
export default {
    props: ["languages", "title"],
    data() {
        return {
            "localTitle": this.title
        }
    }
}
</script>