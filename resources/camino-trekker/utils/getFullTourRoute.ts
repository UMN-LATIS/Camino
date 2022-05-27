import { getStagesFromTourWhere } from "./index";
import type { LngLat } from "../../types";

/**
 * gets all route points from a given tour, including
 * start_location
 * @param {Object} - tour object from api
 * @returns {LngLat[]} - array of route points from every
 * stage
 */
export default (tour): LngLat[] => {
  const navStages = getStagesFromTourWhere("type", "navigation", tour);
  const routePoints = navStages.flatMap((stage) => stage.route);
  return [tour.start_location, ...routePoints];
};
