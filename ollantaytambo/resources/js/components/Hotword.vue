<template>
    <span v-bind:class="{ addedClass: active, emptyClass: !active}" class="hoverWord" @click="active = !active">
        {{ cleanedWord }}
    </span>
</template>

<style scoped>

.hoverWord {
    cursor: pointer;
}

.addedClass {
    border: 1px solid yellow;
}

.emptyClass {
    text-decoration: underline;
}

</style>
<script>
export default {
    props: ["text"],
    data() {
        return {
            active: false
        }
    },
    methods: {
        alert: function(f) {
            alert(f);
        }
    },
    computed: {
        cleanedWord: function() {
            return this.text.replace(/[\[\]]/g, '');
        }
    }
}
</script>