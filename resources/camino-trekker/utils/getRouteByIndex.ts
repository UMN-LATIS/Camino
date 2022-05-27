import { getStagesFromTourWhere } from "./index";
import type { LngLat } from "../../types";

/**
 * gets all route points from a given tour
 * @param {Object} - tour object from api
 * @param { stageIndex } - route from given stage
 * @returns {LngLat[]} - array of route points
 */
export default (tour, stageIndex: number): LngLat[] =>
  getStagesFromTourWhere("type", "navigation", tour)[stageIndex].route;
