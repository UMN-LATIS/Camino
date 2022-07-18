/**
 * returns a list of all tour stops
 * @param {Object} tour
 * @returns {LngLat[]} all tour stops
 */
import { NavigationStage } from "@/types";
import getStagesFromTourWhere from "./getStagesFromTourWhere";

export default (tour) => {
  const startingPoint = tour.start_location;
  const targetPoints = getStagesFromTourWhere<NavigationStage>(
    "type",
    "navigation",
    tour
  ).map((stage) => stage.targetPoint);
  return [startingPoint, ...targetPoints];
};
