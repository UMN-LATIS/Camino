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
 * to get the last non-null target point, use
 * @see findLastTargetPoint
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
