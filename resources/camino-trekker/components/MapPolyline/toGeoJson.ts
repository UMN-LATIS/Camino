import type { LngLat } from "@/types";
import { Feature } from "geojson";

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
export const toGeoJsonLineString = (
  positions: LngLat[],
  opts = {}
): Feature => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: positions.map(({ lng, lat }) => [lng, lat]),
  },
  ...opts,
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
export const toGeoJsonPoint = (location: LngLat): Feature => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: [location.lng, location.lat],
  },
});
