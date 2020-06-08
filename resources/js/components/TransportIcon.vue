<template>
    <i class="fas fa-walking" v-if="tour.walking==1"></i>
    <i class="fas fa-biking" v-else-if="tour.biking==1"></i>
    <i class="fas fa-car" v-else-if="tour.driving==1"></i>
</template>

<script>
export default {
    props: ["tour"]
}
</script>