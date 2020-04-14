<template>
    <div>
        <button @click='$emit("remove", stage)'>Remove Stage</button>
        <slot />

    </div>

</template>
<script>
export default {
    props: ["stage"]
}
</script>