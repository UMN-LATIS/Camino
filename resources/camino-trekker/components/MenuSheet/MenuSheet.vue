<template>
  <Sheet
    class="menu-sheet"
    title="Menu"
    :isOpen="isOpen"
    @close="$emit('close')"
  >
    <ol class="menu-sheet__list">
      <a v-for="(item, i) in menuItems" :key="i" :href="item.href">
        <li class="menu-sheet__list-item">
          <span v-if="!!item.icon" class="material-icons">{{ item.icon }}</span>
          <span>{{ item.text }}</span>
        </li>
      </a>
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
    text: "Home",
    href: "/",
    icon: "home",
  },
  {
    text: "Find Tours",
    href: "/findTours",
    icon: "travel_explore",
  },
  {
    text: "Create a Tour",
    href: "/creator",
    icon: "add_location_alt",
  },
  {
    text: "About Camino",
    href: "/about",
    icon: "arrow_forward",
  },
  {
    text: "Settings",
    href: "/trekker/settings",
    icon: "settings",
  },
  {
    text: "Help",
    href: "https://umn-latis.github.io/Camino/",
    icon: "help_outline",
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
