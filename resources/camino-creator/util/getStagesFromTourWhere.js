import getStagesFromStopWhere from "./getStagesFromStopWhere";

export default (stageKey, stageValue, tour) =>
  tour.stops.flatMap((stop) =>
    getStagesFromStopWhere(stageKey, stageValue, stop)
  );
