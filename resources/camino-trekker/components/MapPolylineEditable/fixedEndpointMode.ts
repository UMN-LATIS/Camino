/**
 * Custom Draw mode for MapboxGL
 * User may edit a line's waypoints by dragging them
 * but cannot edit the endpoints
 *
 * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/MODES.md
 */

import { MyCustomDrawMode } from "@/types";
import DirectSelectMode from "@mapbox/mapbox-gl-draw/src/modes/direct_select";

export const fixedEndpointsMode: MyCustomDrawMode = {
  ...DirectSelectMode,
  toDisplayFeatures(state, geojson, display) {
    return display(geojson);
  },
};
