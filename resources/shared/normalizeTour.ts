import {
  StageType,
  Tour,
  NavigationStage,
  LngLat,
  CoreStage,
  TourStop,
} from "@/types";
import getStagesFromStopWhere from "./getStagesFromStopWhere";
import getOffsetPointFrom from "@/shared/getOffsetPointFrom";
import normalizeTourStopRoute from "./normalizeTourStopRoute";
import { UMN_LNGLAT } from "./constants";
import { indexBy, prop } from "ramda";
import findValuedTargetPointFromTour from "./findValuedTargetPointFromTour";

const getNavStagesFromStop = (stop: TourStop): NavigationStage[] =>
  getStagesFromStopWhere<NavigationStage>("type", StageType.Navigation, stop);

/**
 * normalize each nav stage so that the routes are connected
 * and each stage start point is the previous stage's target point
 * on the first stage, use the stopStartPoint as the start point
 */
function toNormalizedNavStages(
  navStages: NavigationStage[],
  stopStartPoint = UMN_LNGLAT
): NavigationStage[] {
  return navStages.map((stage, stageIndex) => {
    const navStageStartPoint =
      stageIndex === 0
        ? stopStartPoint
        : // previous Nav stage target point
          // which should be defined since we're looping
          // sequentially
          (navStages[stageIndex - 1].targetPoint as LngLat);

    // use the current target point, or if that
    // is null, offset the navStageStartPoint
    const valuedTargetPoint =
      stage.targetPoint ?? getOffsetPointFrom(navStageStartPoint);

    const normaliedRoute = normalizeTourStopRoute(
      navStageStartPoint,
      stage.route || [],
      valuedTargetPoint
    );

    return {
      ...stage,
      targetPoint: valuedTargetPoint,
      route: normaliedRoute,
    };
  });
}

/**
 * returns a tour where all tour stop routes
 * are normalized and all target points are well defined
 * are connected to each other with no gaps.
 * start_location (or default point)
 * -> stop1 route -> stop1 targetPoint
 * -> stop2 route -> stop2 targetPoint -> ...
 *
 * If a target point is not defined this will use the
 * last well defined target point and offset it a bit
 */
export default function normalizeTour(tour: Tour): Tour {
  const updatedTour = structuredClone(tour);

  // we use forEach and mutate in place so that we can
  // proceed sequentially, using previous stop targets in future targets
  updatedTour.stops.forEach((stop, index) => {
    // find the last good target point: this our starting point
    const stopStartPoint = findValuedTargetPointFromTour(updatedTour, {
      stopIndex: index - 1,
    });

    if (!stopStartPoint) {
      // this shouldn't happen, but just in case...
      throw Error(
        `normalizeTour could not get a start point for stop index ${index}`
      );
    }

    const navStages = getNavStagesFromStop(stop);
    const updatedNavStages = toNormalizedNavStages(navStages, stopStartPoint);

    // create a lookup keyed by id to avoid array searches
    const updatedNavStageLookup = indexBy(prop("id"), updatedNavStages);

    // create a list of updated stages. Use the updated Nav if it
    // exists, otherwise, just use the original stage
    const updatedStages: CoreStage[] = stop.stop_content.stages.map(
      (stage) => updatedNavStageLookup[stage.id] ?? stage
    );

    // update this stop's stages
    stop.stop_content.stages = updatedStages;
  });

  return updatedTour;
}
