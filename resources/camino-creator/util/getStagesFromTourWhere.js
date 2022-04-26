import getStagesFromStopWhere from "./getStagesFromStopWhere.js";

export default (stageKey, stageValue, tour) =>
  tour.stops.flatMap((stop) =>
    getStagesFromStopWhere(stageKey, stageValue, stop)
  );
