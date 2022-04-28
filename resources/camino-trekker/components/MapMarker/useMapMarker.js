import { watch, ref, unref } from "vue";
import { Marker } from "mapbox-gl";

export default (mapRef, props) => {
  const marker = ref(null);

  watch([mapRef, props], () => {
    const map = unref(mapRef);

    // if no map yet, nothing to do
    if (!map) return;

    // remove old marker if it exists
    const oldMarker = unref(marker);
    if (oldMarker) oldMarker.remove();

    marker.value = new Marker({ color: props.color })
      .setLngLat([props.lng, props.lat])
      .addTo(map);
  });

  return { marker };
};
