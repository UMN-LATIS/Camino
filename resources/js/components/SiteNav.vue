<template>
  <BNavbar toggleable="sm" type="light" variant="light">
    <BNavbarBrand href="/">Camino</BNavbarBrand>

    <BNavbarToggle target="nav-collapse"></BNavbarToggle>

    <BCollapse id="nav-collapse" isNav>
      <BNavbarNav class="ml-auto">
        <BNavItem href="/about" :active="currentRoute == 'about'"
          >About</BNavItem
        >
        <BNavItem href="/findTours" :active="currentRoute == 'findTours'"
          >Find Tours</BNavItem
        >
        <BNavItem href="/creator">Create</BNavItem>
        <BNavItem href="https://umn-latis.github.io/Camino/">Help</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>

<script>
export default {
  props: ["current-route"],
};
</script>
