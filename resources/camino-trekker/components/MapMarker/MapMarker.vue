<template><slot></slot></template>
<script setup>
import { number, string } from "vue-types";
import { inject, provide } from "vue";
import useMapMarker from "./useMapMarker";

const props = defineProps({
  lng: number().isRequired,
  lat: number().isRequired,
  color: string(),
});

const map = inject("map");

const { marker } = useMapMarker(map, props);
provide("marker", marker);
</script>
