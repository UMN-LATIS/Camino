<template>
    <div>
        <i class="fas fa-grip-vertical handle"></i>
        <button @click='$emit("remove", stage)'>Remove Stage</button>
        <slot />

    </div>

</template>
<script>
export default {
    props: ["stage"]
}
</script>