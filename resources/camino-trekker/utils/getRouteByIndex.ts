/// <reference path="../types.ts" />;
import { LngLat } from "../types.js";
import { getStagesFromTourWhere } from "./index.js";

/**
 * gets all route points from a given tour
 * @param {Object} - tour object from api
 * @param { stageIndex } - route from given stage
 * @returns {LngLat[]} - array of route points
 */
export default (tour, stageIndex: number): LngLat[] =>
  getStagesFromTourWhere("type", "navigation", tour)[stageIndex].route;
