// based on styles in "@mapbox/mapbox-gl-draw/src/lib/theme";

// Colors
const orange = "#FF9D25";
const pink = "#ff295d";
// const pinkLight = "rgba(255, 190, 206, 0.5)";

// Hide the start/end anchor vertices and the phantom midpoints
// immediately adjacent to them. The endpoints are derived from
// prior stops — the user doesn't own them and shouldn't be able to
// select them or create new waypoints clustered against them.
//
// The first anchor's coord_path is statically "0" so it lives in
// the style filter. The last anchor's coord_path changes with
// waypoint count, so MapPolylineEditable adds dynamic `coord_path
// != "<last>"` clauses via `map.setFilter` after each render.
export default [
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "midpoint"],
      ["!=", "coord_path", "0"],
    ],
    paint: {
      "circle-radius": 4,
      "circle-color": orange,
    },
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#fbb03b",
      "line-dasharray": [0.2, 2],
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "LineString"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": orange,
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": orange,
      "line-dasharray": [0.2, 2],
      "line-width": 3,
    },
  },
  // Vertex circles. Two stacked layers — a white halo and a pink
  // inner — render every waypoint. When the user clicks a vertex
  // it gets `active == "true"`; we grow both layers and add a dark
  // ring around the inner so it reads as "selected, about to act on."
  {
    id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
      ["!=", "coord_path", "0"],
    ],
    paint: {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 11, 7],
      "circle-color": "#fff",
    },
  },
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
      ["!=", "coord_path", "0"],
    ],
    paint: {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 8, 5],
      "circle-color": pink,
      "circle-stroke-width": ["case", ["==", ["get", "active"], "true"], 2, 0],
      "circle-stroke-color": "#111",
    },
  },
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#404040",
      "fill-outline-color": "#404040",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
];
