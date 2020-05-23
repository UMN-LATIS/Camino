<template>
    <span v-bind:class="{ addedClass: isActive, emptyClass: !isActive}" class="hoverWord" @click="toggleWord">
        <slot></slot>
    </span>
</template>

<style scoped>

.hoverWord {
    cursor: pointer;
}

.addedClass {
    /* border: 3px solid blue; */
}

.emptyClass {
    text-decoration: underline;
    font-weight: bold
}

.addedClass:after {
  content: "✭";
  color: darkkhaki;
  font-size: 100%; 
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
        toggleWord: function() {
            if(this.isActive) {
                this.$store.commit('removeHotword', this.cleanedWord);
            }
            else {
                this.$store.commit('addHotword', this.cleanedWord);
            }
        }
    },
    computed: {
        isActive: function() {
            return this.$store.getters.hotwords.filter(w => w == this.cleanedWord).length > 0;
        },
        cleanedWord: function() {
            return this.$slots.default[0].text
        }
    }
}
</script>