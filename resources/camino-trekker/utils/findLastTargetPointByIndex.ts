import { UMN_LNGLAT } from "@/shared/constants";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import { Tour, LngLat, NavigationStage, StageType, Maybe } from "@/types";

/**
 * finds the target point for a last targetPoint working backward from
 * a given stop index.
 * The search will continue looking at previous stops until a target
 * point is found, or failing that the start_location
 * If no start location is found, a default location will be returned.
 *
 * @param {Tour} tour - the tour
 * @param {number}  stopIndex - the stop index. If index is negative,
 * the start location will be return
 */
export function findLastTargetPointByIndex(
  tour: Maybe<Tour>,
  stopIndex: number,
  defaultLngLat: LngLat = UMN_LNGLAT
): LngLat {
  // base case
  if (!tour) return defaultLngLat;
  if (stopIndex < 0) {
    return tour.start_location ?? defaultLngLat;
  }

  // recursively try to get stop point
  const stopAtIndex = tour.stops[stopIndex];
  const navStagesAtStop = getStagesFromStopWhere(
    "type",
    StageType.Navigation,
    stopAtIndex
  ) as NavigationStage[];

  // if no nav stages here, try the previous stop
  if (!navStagesAtStop.length) {
    return findLastTargetPointByIndex(tour, stopIndex - 1);
  }

  const targetPoint = navStagesAtStop[navStagesAtStop.length - 1].targetPoint;

  // targetPoint could be null. If it is, try the previous stop
  return targetPoint || findLastTargetPointByIndex(tour, stopIndex - 1);
}
