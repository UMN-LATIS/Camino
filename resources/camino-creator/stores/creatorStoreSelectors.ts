import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";
import type { CreatorStoreState } from "./useCreatorStore";
import {
  TourStop,
  Tour,
  Locale,
  TourStopRoute,
  Maybe,
  NavigationStage,
  StageType,
  LngLat,
} from "@/types";
import { UMN_LNGLAT } from "@/shared/constants";

/**
 * Selectors are:
 * - pure functions. That is they derive results from state, arguments, and other selectors (no getters)
 * - return a real object (i.e. not a computed ref)
 * - take the current state as the first argument.
 */

/**
 * selects a tour by id
 */
export const selectTour = (
  currentState: CreatorStoreState,
  tourId: number
): Tour => {
  const tour = currentState.tours.value.find((tour) => tour.id === tourId);
  if (!tour) {
    throw new Error(`a tour with id ${tourId} does not exist in the store`);
  }
  return tour;
};

/**
 * selects a tour stop by tour id and stop id
 */
export const selectTourStop = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): TourStop => {
  const tour = selectTour(currentState, tourId);
  const stop = tour.stops.find((stop) => stop.id === stopId);
  if (!stop) {
    throw new Error(
      `tour stop with tour id ${tourId} and stop id $${stopId} does not exist in the`
    );
  }
  return stop;
};

/**
 * selects the index of a tour in the store.tours array
 */
export const selectTourIndex = (
  currentState: CreatorStoreState,
  tourId: number
): number => {
  const index = currentState.tours.value.findIndex((t) => t.id === tourId);
  if (index === -1) {
    throw new Error(`cannot find index of tourId: ${tourId}`);
  }
  return index;
};

/**
 * select the location of a tour stop by index in store.tours
 * that is, it gets index of tour in `store.tours`
 * and then the index of the stop in
 * `store.tours[tourIndex].stops`
 */
export const selectTourAndStopIndex = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): {
  tourIndex: number;
  stopIndex: number;
} => {
  const tourIndex = selectTourIndex(currentState, tourId);
  const stopIndex = currentState.tours.value[tourIndex].stops.findIndex(
    (stop) => stop.id === stopId
  );
  if (stopIndex === -1) {
    throw new Error(`stop with id ${stopId} does not exist`);
  }
  return {
    tourIndex,
    stopIndex,
  };
};

export const selectStopIndex = (
  currentState: CreatorStoreState,
  tourId,
  stopId
): number => {
  return selectTourAndStopIndex(currentState, tourId, stopId).stopIndex;
};

/**
 * select the title of a tour
 **/
export const selectTourTitle = (
  currentState: CreatorStoreState,
  tourId: number
): string => selectTour(currentState, tourId).title;

/**
 * select supported languages for a given tour
 */
export const selectTourLanguages = (
  currentState: CreatorStoreState,
  tourId: number
): Locale[] => selectTour(currentState, tourId).tour_content.languages;

/**
 * select the first supported language for a given tour
 * if no languages are supported, defaults to english
 */
export const selectDefaultTourLanguage = (
  currentState: CreatorStoreState,
  tourId: number
): Locale =>
  selectTour(currentState, tourId).tour_content.languages[0] || Locale.en;

/**
 * select index of a stage by its stage id
 */
export const selectStageIndexById = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number,
  stageId: string
): {
  tourIndex: number;
  stopIndex: number;
  stageIndex: number;
} => {
  const { tourIndex, stopIndex } = selectTourAndStopIndex(
    currentState,
    tourId,
    stopId
  );
  const stageIndex = currentState.tours.value[tourIndex].stops[
    stopIndex
  ].stop_content.stages.findIndex((s) => s.id === stageId);

  if (stageIndex === -1) {
    throw new Error(`Cannot find stage with id ${stageId}`);
  }

  return {
    tourIndex,
    stopIndex,
    stageIndex,
  };
};

/**
 * selects tour stop route by tour id and stop id
 */
export const selectTourStopRoute = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<TourStopRoute> => {
  const stop = selectTourStop(currentState, tourId, stopId);
  const navStagesAtStop = getStagesFromStopWhere<NavigationStage>(
    "type",
    StageType.Navigation,
    stop
  );

  const fullStopRoute = navStagesAtStop
    .flatMap((stage) => stage.route ?? [])
    .filter((x): x is LngLat => Boolean(x));

  return fullStopRoute;
};

/**
 * select the target point set at a given stop
 * if no target point is set, returns null
 *
 * @see store.findValuedTargetPoint to get a
 * a target point that is not null
 */
export const selectTourStopTargetPoint = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<LngLat> => {
  const stop = selectTourStop(currentState, tourId, stopId);
  const navStagesAtStop = getStagesFromStopWhere<NavigationStage>(
    "type",
    StageType.Navigation,
    stop
  );

  if (!navStagesAtStop.length) {
    return null;
  }

  const lastNavStage = navStagesAtStop[navStagesAtStop.length - 1];
  return lastNavStage.targetPoint;
};

/**
 * select the next stop in the tour
 * if no next stop exists, returns null
 */
export const selectNextTourStop = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<TourStop> => {
  const { tourIndex, stopIndex } = selectTourAndStopIndex(
    currentState,
    tourId,
    stopId
  );
  return currentState.tours.value[tourIndex].stops[stopIndex + 1] ?? null;
};

/**
 * select the previous stop in the tour
 */
export const selectPrevTourStop = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<TourStop> => {
  const { tourIndex, stopIndex } = selectTourAndStopIndex(
    currentState,
    tourId,
    stopId
  );
  return currentState.tours.value[tourIndex].stops[stopIndex - 1] ?? null;
};

/**
 * selecst the next stop route in the tour
 */
export const selectNextTourStopRoute = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<TourStopRoute> => {
  const nextStop = selectNextTourStop(currentState, tourId, stopId);
  if (!nextStop) {
    return null;
  }
  return selectTourStopRoute(currentState, tourId, nextStop.id);
};

/**
 * selects the starting point for a given tour stop
 */
export const selectTourStopStartPoint = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<LngLat> => {
  const stop = selectTourStop(currentState, tourId, stopId);
  const navStagesAtStop = getStagesFromStopWhere<NavigationStage>(
    "type",
    StageType.Navigation,
    stop
  );

  return navStagesAtStop?.[0]?.route?.[0] ?? null;
};

/**
 * selects the next stop's starting point
 */
export const selectNextTourStopStartPoint = (
  currentState: CreatorStoreState,
  tourId: number,
  stopId: number
): Maybe<LngLat> => {
  const nextStop = selectNextTourStop(currentState, tourId, stopId);
  if (!nextStop) {
    return null;
  }
  return selectTourStopStartPoint(currentState, tourId, nextStop.id);
};

/**
 * finds a non-null target point for a given stop, searching
 * previous stops and the tour's starting point until one
 * is found
 *
 * if no target point is found, retuns a default LngLat
 */
export const findValuedTargetPoint = (
  currentState: CreatorStoreState,
  tourId: number | null | undefined,
  stopId: number | null | undefined
): LngLat => {
  const DEFAULT_TARGET_POINT = UMN_LNGLAT;

  // assuming valid ids are always positive
  if (!tourId) {
    return DEFAULT_TARGET_POINT;
  }

  try {
    const tour = selectTour(currentState, tourId);

    if (!stopId) {
      return tour.start_location ?? DEFAULT_TARGET_POINT;
    }

    // first try the
    const targetPoint = selectTourStopTargetPoint(currentState, tourId, stopId);
    if (targetPoint) return targetPoint;

    // if no nav stages here, recursively try the previous stop
    const prevStop = selectPrevTourStop(currentState, tourId, stopId);
    return prevStop
      ? findValuedTargetPoint(currentState, tourId, prevStop.id)
      : tour.start_location ?? DEFAULT_TARGET_POINT;
  } catch (e) {
    // if tour or stop not found, return default
    return DEFAULT_TARGET_POINT;
  }
};

export const findFirstValuedTargetPoint = (currentState, tourId): LngLat => {
  const tour = selectTour(currentState, tourId);

  if (tour.start_location) return tour.start_location;

  // get a list of all non-null target points
  const targetPoints = tour.stops
    .map((stop) => selectTourStopTargetPoint(currentState, tourId, stop.id))
    .filter(Boolean) as LngLat[];

  // return the first or the default point
  return targetPoints.length ? targetPoints[0] : UMN_LNGLAT;
};
