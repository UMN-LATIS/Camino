/**
 * returns a list of all tour stops
 * @param {Object} tour
 * @returns {LngLat[]} all tour stops
 */
import { getStagesFromTourWhere } from "./index";

export default (tour) => {
  const startingPoint = tour.start_location;
  const targetPoints = getStagesFromTourWhere("type", "navigation", tour).map(
    (stage) => stage.targetPoint
  );
  return [startingPoint, ...targetPoints];
};
