import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import {
  Tour,
  NavigationStage,
  StageType,
  TourStopRoute,
  LngLat,
  Maybe,
} from "@/types";
import { findLastTargetPoint } from "./findLastTargetPoint";

export function getStopRouteByIndex(
  tour: Maybe<Tour>,
  index: number
): TourStopRoute {
  if (!tour) return [];

  const stopAtIndex = tour.stops[index];
  const navStagesAtStop = getStagesFromStopWhere<NavigationStage>(
    "type",
    StageType.Navigation,
    stopAtIndex
  );

  // for all the navStages at this stop
  // combine any nav routes into a single list of points
  // and remove any falsy values that might have crept in
  const fullStopRoute = navStagesAtStop
    .flatMap((stage) => stage.route ?? [])
    .filter((x): x is LngLat => Boolean(x));

  // make sure the previous stop target point begins the route
  // and the current stop target point ends the route
  return [
    findLastTargetPoint(tour, index - 1),
    ...fullStopRoute,
    findLastTargetPoint(tour, index),
  ];
}
