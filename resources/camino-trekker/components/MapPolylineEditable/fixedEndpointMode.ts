/**
 * Custom Draw mode for MapboxGL
 * User may edit a line's waypoints by dragging them
 * but cannot edit the endpoints
 *
 * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/MODES.md
 */

import { MyCustomDrawMode, LngLat } from "@/types";
import { LineString } from "geojson";
import { toGeoJsonPoint, toGeoJsonLineString } from "../MapPolyline/toGeoJson";
import DirectSelectMode from "@mapbox/mapbox-gl-draw/src/modes/direct_select";

export const fixedEndpointsMode: MyCustomDrawMode = {
  onSetup(opts) {
    console.log(opts);
  },
  onClick(state, event) {
    console.log(state, event);
  },

  toDisplayFeatures(state, geojson, display) {
    return display(geojson);
  },
};
