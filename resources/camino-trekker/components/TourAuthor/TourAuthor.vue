<template>
  <div class="tour-author">
    <Gravatar
      class="tour-author__img"
      :email="author.email"
      :name="author.name"
    />
    <div class="tour-author__body">
      <p class="tour-author__name">{{ author.name }}</p>
      <p class="tour-author__title">{{ author.title }}</p>
    </div>
  </div>
</template>
<script setup>
import Gravatar from "../Gravatar/Gravatar.vue";
import { shape, string } from "vue-types";

defineProps({
  author: shape({
    name: string().isRequired,
    email: string().isRequired,
    title: string().def("Tour Guide"),
    institution: string(),
  }),
});
</script>
<style scoped>
.tour-author {
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 0.5rem;
  align-items: center;
}
.tour-author__name,
.tour-author__title,
.tour-author p {
  margin: 0;
  line-height: 1.4;
}

.tour-author__name {
  font-weight: 600;
}

.tour-author__title,
.tour-author__institution {
  font-size: 0.75rem;
}
</style>
