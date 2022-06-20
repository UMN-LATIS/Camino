import getStagesFromStopWhere from "./getStagesFromStopWhere";
import { Tour, NavigationStage, StageType, TourStopRoute } from "@/types";

export function getStopRouteAtIndex(tour: Tour, index: number): TourStopRoute {
  const stopAtIndex = tour.stops[index];
  const navStagesAtStop = getStagesFromStopWhere(
    "type",
    StageType.Navigation,
    stopAtIndex
  ) as NavigationStage[];

  const routesAtStop = navStagesAtStop.flatMap((stage) => stage.route);

  return navStagesAtStop ? routesAtStop : [];
}
