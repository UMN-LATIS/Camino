<template>
  <div class="bottom-nav">
    <nav class="bottom-nav__navbar">
      <button
        class="bottom-nav__button"
        @click="store.setActiveSheet(BottomNavSheet.Menu)"
      >
        <span class="material-icons">menu</span>
        <span class="sr-only">Menu</span>
      </button>
      <button
        class="bottom-nav__progress-button"
        @click="store.setActiveSheet(BottomNavSheet.Stoplist)"
      >
        <ProgressIndicator
          :total="store.totalStops"
          :active="store.stopIndex"
        />
        <span class="sr-only">Open Tour Stops</span>
      </button>
      <button
        class="bottom-nav__button"
        @click="store.setActiveSheet(BottomNavSheet.Map)"
      >
        <span class="material-icons">map</span>
        <span class="sr-only">Map</span>
      </button>
    </nav>
    <div>
      <Teleport to="#modals">
        <MenuSheet
          :isOpen="store.isActiveSheet(BottomNavSheet.Menu)"
          @close="store.closeActiveSheet()"
        />
        <StopListSheet
          :isOpen="store.isActiveSheet(BottomNavSheet.Stoplist)"
          @close="store.closeActiveSheet()"
        />
        <MapSheet
          :isOpen="store.isActiveSheet(BottomNavSheet.Map)"
          @close="store.closeActiveSheet()"
        />
      </Teleport>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTrekkerStore } from "@/camino-trekker/stores/useTrekkerStore";
import ProgressIndicator from "../ProgressIndicator/ProgressIndicator.vue";
import MapSheet from "../MapSheet/MapSheet.vue";
import MenuSheet from "../MenuSheet/MenuSheet.vue";
import StopListSheet from "../StopListSheet/StopListSheet.vue";
import { BottomNavSheet } from "@/types";

const store = useTrekkerStore();
</script>
<style scoped>
.bottom-nav {
  border: 1px solid hsla(0, 0%, 100%, 0.8);
  background: hsla(0, 0%, 100%, 0.6);
  /* TODO: make this happen with autoprefixer */
  -webkit-backdrop-filter: blur(1.5rem);
  backdrop-filter: blur(1.5rem);
  box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1.25rem;
  z-index: 30;
}

.bottom-nav__navbar {
  display: grid;
  grid-template-columns: min-content minmax(0, 1fr) min-content;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  max-width: 52rem;
  margin: 0 auto;
}
.bottom-nav__button {
  background: transparent;
  border: 0;
  color: var(--black);
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all ease-out 0.3s;
}
.bottom-nav__button:hover,
.bottom-nav__progress-button:hover {
  background: hsla(0, 0%, 0%, 0.1);
  color: var(--black);
}
button:active {
  background: var(--white);
  color: var(--black);
}
.bottom-nav__progress-button {
  transition: all ease-out 0.3s;
  display: flex;
  background: transparent;
  flex: 1;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  border: 0;
}
</style>
