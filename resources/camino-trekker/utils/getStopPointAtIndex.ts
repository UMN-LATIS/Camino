import { UMN_LNGLAT } from "@/shared/constants";
import getStagesFromStopWhere from "./getStagesFromStopWhere";
import { Tour, LngLat, NavigationStage, StageType } from "@/types";

/**
 * finds the target point for a last navigation stage tour stop at a given index
 * If no stop point is found, the search will recursively look
 * for target points at previous stops.
 * If no previous target point is found, the start_location
 * or a default location will be returned.
 *
 * @param {Tour} tour - the tour
 * @param {number}  index - the stop index. If index is negative,
 * the start location will be return
 */
export function getStopPointAtIndex(
  tour: Tour,
  index: number,
  defaultLngLat: LngLat = UMN_LNGLAT
): LngLat {
  // base case
  if (index < 0) {
    return tour.start_location ?? defaultLngLat;
  }

  // recursively try to get stop point
  const stopAtIndex = tour.stops[index];
  const navStagesAtStop = getStagesFromStopWhere(
    "type",
    StageType.Navigation,
    stopAtIndex
  ) as NavigationStage[];

  // if no nav stages here, try the previous stop
  if (!navStagesAtStop.length) {
    return getStopPointAtIndex(tour, index - 1);
  }

  const targetPoint = navStagesAtStop[navStagesAtStop.length - 1].targetPoint;

  // targetPoint could be null. If it is, try the previous stop
  return targetPoint || getStopPointAtIndex(tour, index - 1);
}
