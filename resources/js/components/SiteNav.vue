<template>
 <b-navbar toggleable="sm" type="light" variant="light">
    <b-navbar-brand href="/">Camino</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/about" :active="currentRoute=='about'">About</b-nav-item>
        <b-nav-item href="/findTours" :active="currentRoute=='findTours'">Find Tours</b-nav-item>
        <b-nav-item href="/creator">Create</b-nav-item>
        <b-nav-item href="https://umn-latis.github.io/Camino/">Help</b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
    props: ["current-route"]
}
</script>