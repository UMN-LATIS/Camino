/**
 * Pure tour mutations. Each one takes a Tour and returns a new Tour
 * — no shared state, no Vue, no store. The store dispatches these
 * after a user gesture and replaces its state with the result.
 *
 * `moveStartAnchor` is the interesting one: dragging the start
 * point of stop N>0 is *not* a mutation on stop N. It mutates
 * stop N-1's last-nav-stage `targetPoint` (or `tour.start_location`
 * for stop 0). The derivation rules in `tourGeometry.ts` decide
 * which prior stop "owns" the anchor; this function mirrors that
 * logic so the data and the visual stay in sync.
 */

import {
  type Tour,
  type TourStop,
  type NavigationStage,
  type LngLat,
  type Maybe,
  StageType,
} from "@/types";

export function setWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
  point: LngLat,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    const waypoints = stage.waypoints ?? [];
    if (index < 0 || index >= waypoints.length) return stage;
    const next = [...waypoints];
    next[index] = point;
    return { ...stage, waypoints: next };
  });
}

export function insertWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
  point: LngLat,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    const waypoints = stage.waypoints ?? [];
    const next = [
      ...waypoints.slice(0, index),
      point,
      ...waypoints.slice(index),
    ];
    return { ...stage, waypoints: next };
  });
}

export function removeWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    const waypoints = stage.waypoints ?? [];
    if (index < 0 || index >= waypoints.length) return stage;
    const next = [...waypoints.slice(0, index), ...waypoints.slice(index + 1)];
    return { ...stage, waypoints: next };
  });
}

export function setTargetPoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  point: Maybe<LngLat>,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => ({
    ...stage,
    targetPoint: point,
  }));
}

/**
 * Moves the visual start anchor of `stopId` to `point`. For stop 0
 * this writes `tour.start_location`. For any later stop it writes
 * the previous stop's last-nav-stage `targetPoint`, cascading back
 * through earlier stops with null targets — the same cascade
 * `getStopStartPoint` uses to *read* the anchor. If the cascade
 * finds no prior target, the write lands on `tour.start_location`.
 */
export function moveStartAnchor(
  tour: Tour,
  stopId: number,
  point: LngLat,
): Tour {
  const stopIndex = tour.stops.findIndex((stop) => stop.id === stopId);
  if (stopIndex < 0) return tour;

  for (let i = stopIndex - 1; i >= 0; i--) {
    if (lastNavStageTargetPoint(tour.stops[i])) {
      return setLastNavStageTargetPoint(tour, i, point);
    }
  }
  return { ...tour, start_location: point };
}

function updateNavStage(
  tour: Tour,
  stopId: number,
  stageId: string,
  transform: (stage: NavigationStage) => NavigationStage,
): Tour {
  return {
    ...tour,
    stops: tour.stops.map((stop) => {
      if (stop.id !== stopId) return stop;
      return {
        ...stop,
        stop_content: {
          ...stop.stop_content,
          stages: stop.stop_content.stages.map((stage) => {
            if (stage.id !== stageId) return stage;
            if (stage.type !== StageType.Navigation) return stage;
            return transform(stage as NavigationStage);
          }),
        },
      };
    }),
  };
}

function lastNavStageTargetPoint(stop: TourStop): Maybe<LngLat> {
  const navStages = stop.stop_content.stages.filter(
    (stage): stage is NavigationStage => stage.type === StageType.Navigation,
  );
  for (let i = navStages.length - 1; i >= 0; i--) {
    if (navStages[i].targetPoint) return navStages[i].targetPoint;
  }
  return null;
}

/**
 * Writes `point` onto the last-defined-target nav stage in
 * `stopIndex`. If no nav stage has a target yet, falls back to
 * writing the *last* nav stage's target. If the stop has no nav
 * stages at all, the tour is returned unchanged.
 */
function setLastNavStageTargetPoint(
  tour: Tour,
  stopIndex: number,
  point: LngLat,
): Tour {
  const stop = tour.stops[stopIndex];
  const navStages = stop.stop_content.stages.filter(
    (stage): stage is NavigationStage => stage.type === StageType.Navigation,
  );
  if (navStages.length === 0) return tour;

  let targetNavStageId: string | null = null;
  for (let i = navStages.length - 1; i >= 0; i--) {
    if (navStages[i].targetPoint) {
      targetNavStageId = navStages[i].id;
      break;
    }
  }
  if (targetNavStageId === null) {
    targetNavStageId = navStages[navStages.length - 1].id;
  }

  return updateNavStage(tour, stop.id, targetNavStageId, (stage) => ({
    ...stage,
    targetPoint: point,
  }));
}
