import { prop } from "ramda";
import type { BoundingBox, LngLat, Maybe } from "@/types";
const compareUsing = (fn) => (acc, x) => fn(acc, x);

/**
 * returns bounding box corner points which contain
 * a given route
 *
 * @param {LngLat[]} listOfLngLats - list of positions
 * @returns SW and NE corner points of the
 *  bounding box: [[minLng, minLat], [maxLng, maxLat]]
 */
export default (maybeLngLats: Maybe<LngLat>[]): BoundingBox => {
  const listOfLngLats = maybeLngLats.filter(Boolean) as LngLat[];

  const minLng = listOfLngLats
    .map((pt) => pt.lng)
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
