/**
 * Pure tour mutations: Tour in, Tour out. `moveStartAnchor` follows
 * the same cascade as `getStopStartPoint` — dragging stop N's visual
 * start writes onto stop N-1's target (or `tour.start_location`).
 */

import {
  type Tour,
  type TourStop,
  type NavigationStage,
  type LngLat,
  type Maybe,
  StageType,
} from "@/types";

/** @pure */
export function setWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
  point: LngLat,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    if (index < 0 || index >= stage.route.length) return stage;
    const route = [...stage.route];
    route[index] = point;
    return { ...stage, route };
  });
}

/** @pure */
export function insertWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
  point: LngLat,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    const route = [
      ...stage.route.slice(0, index),
      point,
      ...stage.route.slice(index),
    ];
    return { ...stage, route };
  });
}

/** @pure */
export function removeWaypoint(
  tour: Tour,
  stopId: number,
  stageId: string,
  index: number,
): Tour {
  return updateNavStage(tour, stopId, stageId, (stage) => {
    if (index < 0 || index >= stage.route.length) return stage;
    const route = [
      ...stage.route.slice(0, index),
      ...stage.route.slice(index + 1),
    ];
    return { ...stage, route };
  });
}

/** @pure */
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
 * Writes `point` where `getStopStartPoint` would *read* the anchor
 * from — the prior stop's last-defined target, falling back to
 * `tour.start_location`.
 * @pure
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

/** @pure */
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

/** @pure */
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
 * Writes `point` onto the last-defined-target nav stage in the stop,
 * falling back to the last stage if none have a target. No-op if the
 * stop has no nav stages.
 * @pure
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
