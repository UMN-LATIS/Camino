import { CoreStage, Tour } from "@/types";
import getStagesFromStopWhere from "@/shared/getStagesFromStopWhere";

export default <T extends CoreStage>(
  stageKey: string,
  stageValue: T[keyof T],
  tour: Tour
): T[] =>
  tour.stops.flatMap((stop) =>
    getStagesFromStopWhere<T>(stageKey, stageValue, stop)
  );
