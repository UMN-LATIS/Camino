<template>
    <i class="fas fa-walking" v-if="transport_type==0"></i>
    <i class="fas fa-biking" v-else-if="transport_type==1"></i>
    <i class="fas fa-car" v-else-if="transport_type==2"></i>
</template>

<script>
export default {
    props: ["transport_type"]
}
</script>