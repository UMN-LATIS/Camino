<template>
    <div>
        <span class="text-muted">Guide</span>
        <hotwords v-for="(text,index) in stage.text[$i18n.locale]" :key="index" :text="text">
            {{ text }}
        </hotwords>
    </div>
</template>

<script>
export default {
    props: ["stage"]
}
</script>