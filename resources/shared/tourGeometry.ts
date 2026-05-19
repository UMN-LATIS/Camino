/**
 * Pure derivations over a tour's geometry under the new model.
 *
 * A tour is a chain of named anchor points (the tour's
 * `start_location` and each stop's `targetPoint`) connected by
 * polylines made of interior waypoints only. Stop endpoints are
 * never stored on a stop — they are derived from neighboring stops
 * at read time. This file is where that derivation lives.
 *
 * Everything here is pure: take a Tour, return geometry. Recompute
 * freely; nothing can drift because there is no second copy to
 * drift from.
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
 * The last non-null `targetPoint` across the stop's nav stages, or
 * null if every nav stage has a null target.
 */
function getLastDefinedTarget(stop: TourStop): Maybe<LngLat> {
  const navStages = getNavigationStages(stop);
  for (let i = navStages.length - 1; i >= 0; i--) {
    if (navStages[i].targetPoint) return navStages[i].targetPoint;
  }
  return null;
}

export function getTourStartPoint(tour: Tour): Maybe<LngLat> {
  return tour.start_location;
}

/**
 * The starting point of the stop at the given index.
 *
 * Stop 0 starts at `tour.start_location`. A later stop starts at the
 * most recent prior stop whose last nav stage has a non-null
 * `targetPoint`; if every prior stop is missing one we cascade all
 * the way back to `tour.start_location`.
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
 * The ending point of the stop — its last nav stage's targetPoint,
 * or null if no nav stage has one set.
 */
export function getStopEndPoint(tour: Tour, stopIndex: number): Maybe<LngLat> {
  const stop = tour.stops[stopIndex];
  if (!stop) return null;
  return getLastDefinedTarget(stop);
}

/**
 * The polyline to draw for the stop: `[start, ...waypoints, end]`.
 * Null endpoints drop out so a partially-edited stop still renders a
 * partial line instead of blowing up. Returns `[]` for an out-of-
 * range index.
 */
export function getStopPolyline(tour: Tour, stopIndex: number): LngLat[] {
  const stop = tour.stops[stopIndex];
  if (!stop) return [];

  const start = getStopStartPoint(tour, stopIndex);
  const end = getStopEndPoint(tour, stopIndex);
  const waypoints = getNavigationStages(stop).flatMap(
    (stage) => stage.waypoints ?? [],
  );

  return [start, ...waypoints, end].filter(
    (point): point is LngLat => point !== null,
  );
}

/**
 * The starting point for a specific nav stage within a stop. The
 * first nav stage starts at the stop's derived start. A later nav
 * stage starts at the previous nav stage's `targetPoint`, or, if
 * that's null, cascades back through earlier stages and ultimately
 * to the stop's derived start.
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
