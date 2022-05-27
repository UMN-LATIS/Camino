import { Stage, Tour } from "@/types";
import getStagesFromStopWhere from "./getStagesFromStopWhere";

export default <T extends Stage>(
  stageKey: string,
  stageValue: T[keyof T],
  tour: Tour
): T[] =>
  tour.stops.flatMap((stop) =>
    getStagesFromStopWhere<T>(stageKey, stageValue, stop)
  );
