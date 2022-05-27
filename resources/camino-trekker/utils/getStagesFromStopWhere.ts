import type { TourStop, Stage } from "@/types";

export default <T extends Stage>(
  stageKey: string,
  stageValue: T[keyof T],
  stop: TourStop
): T[] => {
  const stages = stop.stop_content.stages as T[];
  return stages.filter((stage) => stage[stageKey] === stageValue);
};
