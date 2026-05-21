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

/** Nearest prior stop's last-defined targetPoint, falling back to `tour.start_location`. */
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

export function getStopEndPoint(tour: Tour, stopIndex: number): Maybe<LngLat> {
  const stop = tour.stops[stopIndex];
  if (!stop) return null;
  return getLastDefinedTarget(stop);
}

/** Full polyline `[start, ...route, end]`; null endpoints drop out so partial edits still render. */
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
