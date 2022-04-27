<template>
  <Sheet
    class="menu-sheet"
    title="Menu"
    :isOpen="isOpen"
    @close="$emit('close')"
  >
    <ol class="menu-sheet__list">
      <router-link v-for="(item, i) in menuItems" :key="i" :to="item.href">
        <li class="menu-sheet__list-item">
          <span v-if="!!item.icon" class="material-icons">{{ item.icon }}</span>
          <span>{{ item.text }}</span>
        </li>
      </router-link>
    </ol>
  </Sheet>
</template>
<script setup>
import Sheet from "../Sheet/Sheet.vue";
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);

const menuItems = [
  {
    icon: "home",
    text: "Home",
    href: "/",
  },
  {
    icon: "settings",
    text: "Settings",
    href: "/settings",
  },
  {
    icon: "help_outline",
    text: "Help",
    href: "/help",
  },
];
</script>
<style scoped>
.menu-sheet a {
  text-decoration: none;
}

.menu-sheet__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.menu-sheet__list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  transition: all ease 0.2s;
}
</style>
