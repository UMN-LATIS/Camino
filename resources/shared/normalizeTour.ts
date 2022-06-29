import {
  StageType,
  Tour,
  NavigationStage,
  LngLat,
  Stage,
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

// function selectFinalTargetPointFromStop(stop: TourStop): Maybe<LngLat> {
//   const navStages = getNavStagesFromStop(stop);
//   const targetPoints = navStages.map((s) => s.targetPoint);
//   return targetPoints.length ? targetPoints[targetPoints.length - 1] : null;
// }

// if there's more than one nav stage,
// make sure they all link up with well defined
// routes and targetPoints
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
    // if this is the first stop, use the start_location
    // or if that doesn't exist, use a default tour point
    // for every other stop, use the previous target point
    // const tourStartLocation = tour.start_location ?? UMN_LNGLAT;
    // const stopStartPoint =
    //   index === 0
    //     ? tourStartLocation
    //     : selectFinalTargetPointFromStop(updatedTour.stops[index - 1]) ??
    //       tourStartLocation;

    const stopStartPoint = findValuedTargetPointFromTour(updatedTour, {
      stopIndex: index - 1,
    });

    if (!stopStartPoint) {
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
    const updatedStages: Stage[] = stop.stop_content.stages.map(
      (stage) => updatedNavStageLookup[stage.id] ?? stage
    );

    // update this stop's stages
    stop.stop_content.stages = updatedStages;
  });

  return updatedTour;
}
