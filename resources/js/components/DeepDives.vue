<template>
    <ul>
        <li v-for="deepdive, index in stage.deepdives" :key="index" class="form-check">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" :value="deepdive" @change="change($event.target.checked, deepdive)" :checked="checked(deepdive)">{{ deepdive.title[$i18n.locale] }}
            </label>
        </li>
    </ul>

</template>

<script>
export default {
    props: ["stage"],
    computed: {

    },
    methods: {
        checked(deepdive) {
            return this.$store.getters.deepdives.map(d=>d.title[this.$i18n.locale]).includes(deepdive.title[this.$i18n.locale]);
        },
        change(status, deepdive) {
            if(status) {
                this.$store.commit("addDeepDive", deepdive);
            } else {
                this.$store.commit("removeDeepDive", deepdive);
            }
        }
    }
}
</script>

<style scoped>

ul li {
    list-style: none;
    padding: 0;
}

</style>