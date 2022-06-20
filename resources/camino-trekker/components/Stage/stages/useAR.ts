import { useGeolocation } from "@vueuse/core";
import "@ar-js-org/ar.js";
import "aframe-look-at-component";
import "aframe";

// small wrapper so that we don't load arjs and aframe multiple times
export default () => {
  return useGeolocation();
};
