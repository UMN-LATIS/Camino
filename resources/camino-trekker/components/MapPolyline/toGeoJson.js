const lngLatToArray = ({ lng, lat }) => [lng, lat];

/**
 * Creates a GeoJSON linestring given an array of lng, lat positions
 *
 * @param {Object[]} positions - array of longitude and latitude positions of
 * the linestring
 * @param {number} positions[].lng - longitude
 * @param {number} positions[].lat - latitude
 *
 * @returns {GeoJSON} geojson formatted feature with linestring geometry
 * using positions as coordinates
 */
export const toGeoJsonLineString = (positions) => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: positions.map(lngLatToArray),
  },
});

/**
 * Creates a GeoJSON point feature given a lng, lat position.
 *
 * @param {Object} position
 * @param {number} position.lng - longitude
 * @param {number} position.lat - latitude
 *
 * @returns {GeoJSON} geojson formatted feature with point geometry
 */
export const toGeoJsonPoint = (lngLat) => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: lngLatToArray(lngLat),
  },
});
