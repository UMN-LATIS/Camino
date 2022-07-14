import type { LngLat, Tour, Maybe } from "../../types";
import { getStopRouteByIndex } from "./getStopRouteByIndex";

/**
 * gets all route points from a given tour, including
 * start_location
 * @param {Object} - tour object from api
 * @returns {LngLat[]} - array of route points from every
 * stage
 */
export default (tour: Maybe<Tour>): LngLat[] => {
  if (!tour || !tour.stops.length) return [];
  return tour.stops.flatMap((_, i) => getStopRouteByIndex(tour, i));
};
