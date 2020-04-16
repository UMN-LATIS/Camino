<template>
    <div>
        <hotwords :text="stage.text[$i18n.locale]">
            {{ text }}
        </hotwords>
    </div>
</template>

<script>
export default {
    props: ["stage"]
}
</script>