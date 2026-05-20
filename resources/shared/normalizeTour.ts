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
import cleanNavStageRoute from "./cleanNavStageRoute";
import { UMN_LNGLAT } from "./constants";
import { indexBy, prop } from "ramda";
import { getStopStartPoint } from "./tourGeometry";

const getNavStagesFromStop = (stop: TourStop): NavigationStage[] =>
  getStagesFromStopWhere<NavigationStage>("type", StageType.Navigation, stop);

function toNormalizedNavStages(
  navStages: NavigationStage[],
  stopStartPoint = UMN_LNGLAT,
): NavigationStage[] {
  return navStages.map((stage, stageIndex) => {
    const navStageStartPoint =
      stageIndex === 0
        ? stopStartPoint
        : (navStages[stageIndex - 1].targetPoint as LngLat);

    const valuedTargetPoint =
      stage.targetPoint ?? getOffsetPointFrom(navStageStartPoint);

    const route = cleanNavStageRoute(
      stage.route,
      navStageStartPoint,
      valuedTargetPoint,
    );

    return {
      ...stage,
      targetPoint: valuedTargetPoint,
      route,
    };
  });
}

/** Fetch-boundary chokepoint: interior-only routes, filled-in targetPoints. */
export default function normalizeTour(tour: Tour): Tour {
  const updatedTour = structuredClone(tour);

  // Mutate in place so each stop sees its predecessor's resolved targetPoint.
  updatedTour.stops.forEach((stop, index) => {
    const stopStartPoint = getStopStartPoint(updatedTour, index) ?? UMN_LNGLAT;

    const navStages = getNavStagesFromStop(stop);
    const updatedNavStages = toNormalizedNavStages(navStages, stopStartPoint);
    const updatedNavStageLookup = indexBy(prop("id"), updatedNavStages);

    const updatedStages: CoreStage[] = stop.stop_content.stages.map(
      (stage) => updatedNavStageLookup[stage.id] ?? stage,
    );

    stop.stop_content.stages = updatedStages;
  });

  return updatedTour;
}
