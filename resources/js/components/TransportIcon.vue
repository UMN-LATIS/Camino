<template>
    <span>
        <i class="fas fa-walking" v-if="tour.walking==1"></i>
        <i class="fas fa-biking" v-if="tour.biking==1"></i>
        <i class="fas fa-car" v-if="tour.driving==1"></i>
    </span>
</template>

<script>
export default {
    props: ["tour"]
}
</script>