/**
 * @typedef {[number,number]} LngLatTuple
 * @typedef {[LngLatTuple, LngLatTuple]} BoundingBox
 */

const compareUsing = (fn) => (acc, x) => fn(acc, x);
const prop = (key) => (obj) => obj[key];

/**
 * returns bounding box corner points which contain
 * a given route
 *
 * @param {LngLat[]} listOfLngLats - list of positions
 * @returns {LngLat[][]} - SW and NE corner points of the
 *  bounding box: [[minLng, minLat], [maxLng, maxLat]]
 */
export default (listOfLngLats) => {
  if (!Array.isArray(listOfLngLats)) {
    throw Error(
      `listOfLngLats is not an array ${JSON.stringify(listOfLngLats)}`
    );
  }
  const minLng = listOfLngLats
    .map(prop("lng"))
    .reduce(compareUsing(Math.min), +Infinity);
  const minLat = listOfLngLats
    .map(prop("lat"))
    .reduce(compareUsing(Math.min), +Infinity);
  const maxLng = listOfLngLats
    .map(prop("lng"))
    .reduce(compareUsing(Math.max), -Infinity);
  const maxLat = listOfLngLats
    .map(prop("lat"))
    .reduce(compareUsing(Math.max), -Infinity);
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};
