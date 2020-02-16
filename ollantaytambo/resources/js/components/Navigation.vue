<template>
    <div>
        <span class="text-muted">Navigation</span>
        <p v-for="(instruction,index) in stage.instructions[$i18n.locale]" :key="index">
            {{ instruction }}
        </p>
    </div>
</template>

<script>
export default {
    props: ["stage"]
}
</script>