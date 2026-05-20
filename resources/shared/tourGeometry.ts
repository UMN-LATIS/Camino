/**
 * Pure tour-geometry derivations. Stop endpoints are derived from
 * neighboring stops at read time — `tour.start_location` for stop 0,
 * the prior stop's `targetPoint` for any later stop.
 */

import {
  type Tour,
  type TourStop,
  type NavigationStage,
  type LngLat,
  type Maybe,
  StageType,
} from "@/types";

function getNavigationStages(stop: TourStop): NavigationStage[] {
  return stop.stop_content.stages.filter(
    (stage): stage is NavigationStage => stage.type === StageType.Navigation,
  );
}

/**
 * Last non-null `targetPoint` across the stop's nav stages.
 * @pure
 */
function getLastDefinedTarget(stop: TourStop): Maybe<LngLat> {
  const navStages = getNavigationStages(stop);
  for (let i = navStages.length - 1; i >= 0; i--) {
    if (navStages[i].targetPoint) return navStages[i].targetPoint;
  }
  return null;
}

/** @pure */
export function getTourStartPoint(tour: Tour): Maybe<LngLat> {
  return tour.start_location;
}

/**
 * Derived start for `stopIndex`: nearest prior stop's last-defined
 * targetPoint, cascading back to `tour.start_location`.
 * @pure
 */
export function getStopStartPoint(
  tour: Tour,
  stopIndex: number,
): Maybe<LngLat> {
  for (let i = stopIndex - 1; i >= 0; i--) {
    const priorTarget = getLastDefinedTarget(tour.stops[i]);
    if (priorTarget) return priorTarget;
  }
  return tour.start_location;
}

/**
 * End anchor for the stop: its last non-null nav-stage targetPoint.
 * @pure
 */
export function getStopEndPoint(tour: Tour, stopIndex: number): Maybe<LngLat> {
  const stop = tour.stops[stopIndex];
  if (!stop) return null;
  return getLastDefinedTarget(stop);
}

/**
 * Full polyline `[start, ...route, end]` for the stop. Null endpoints
 * drop out so partial edits still render. `[]` for null tour / bad index.
 * @pure
 */
export function getStopRouteByIndex(
  tour: Maybe<Tour>,
  stopIndex: number,
): LngLat[] {
  if (!tour) return [];
  const stop = tour.stops[stopIndex];
  if (!stop) return [];

  const start = getStopStartPoint(tour, stopIndex);
  const end = getStopEndPoint(tour, stopIndex);
  const interior = getNavigationStages(stop).flatMap((stage) => stage.route);

  return [start, ...interior, end].filter(
    (point): point is LngLat => point !== null,
  );
}

/**
 * Start anchor for a specific nav stage. Cascades back through
 * prior stages' targetPoints, ultimately to the stop's derived start.
 * @pure
 */
export function getNavStageStartPoint(
  tour: Tour,
  stopIndex: number,
  stageId: string,
): Maybe<LngLat> {
  const stop = tour.stops[stopIndex];
  if (!stop) return null;

  const navStages = getNavigationStages(stop);
  const stageIndex = navStages.findIndex((stage) => stage.id === stageId);
  if (stageIndex <= 0) return getStopStartPoint(tour, stopIndex);

  for (let i = stageIndex - 1; i >= 0; i--) {
    if (navStages[i].targetPoint) return navStages[i].targetPoint;
  }
  return getStopStartPoint(tour, stopIndex);
}
