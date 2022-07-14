import { Tour, Maybe, NavigationStage, StageType, LngLat } from "@/types";
import { isNil } from "ramda";
import { UMN_LNGLAT } from "./constants";
import getStagesFromStopWhere from "./getStagesFromStopWhere";

/**
 * searches a tour by stopId or stopIndex, returning
 * a target point for the stop
 * It will recursively search until a valid point is found, so that
 * it will always return a lnglat
 *
 * Order of search:
 * this stop's (last non-null nav stage) target point
 * -> prev stop's (last non-null nav stage) target point
 * -> prev prev stop's target point...
 * -> tour start location
 * -> default point
 */
export default function findValuedTargetPointFromTour(
  tour: Maybe<Tour>,
  { stopId, stopIndex }: { stopId?: number; stopIndex?: number }
): LngLat {
  const DEFAULT_TARGET_POINT = UMN_LNGLAT;

  if (!tour) {
    console.error(
      `findValuedTargetPointFromTour did not get a valid tour. Returning the default target point.`
    );
    return DEFAULT_TARGET_POINT;
  }

  // if no start location, use the default target point
  const startLocation = tour.start_location ?? DEFAULT_TARGET_POINT;

  // undefined/null stopId and index mean we can't search for a target
  // point, so just return the start location
  if (isNil(stopId) && isNil(stopIndex)) return startLocation;

  // look up the stopIndex if we're passed the stopId
  stopIndex = stopIndex || tour.stops.findIndex((stop) => stop.id === stopId);

  // if the stop index is -1, no valid stop was found
  if (stopIndex === -1) return startLocation;

  // if we have a stop, let's search navStages for a target point
  const stop = tour.stops[stopIndex];
  const navStages = getStagesFromStopWhere<NavigationStage>(
    "type",
    StageType.Navigation,
    stop
  );

  // get all the non-null target points from the nav stages
  // (there could technically be one than one in a stop...)
  const targetPoints = navStages
    .map((s) => s.targetPoint)
    .filter(Boolean) as LngLat[];

  // if there are valid target points, return the last one
  if (targetPoints.length) {
    return targetPoints[targetPoints.length - 1];
  }

  // if no valid target points in this stop, look in previous stops
  return findValuedTargetPointFromTour(tour, { stopIndex: stopIndex - 1 });
}
