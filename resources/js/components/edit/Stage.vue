<template>
    <div>
        <h3>test</h3><button @click='$emit("remove", stage)'>Remove Stage</button>
        <slot />

    </div>

</template>
<script>
export default {
    props: ["stage"]
}
</script>