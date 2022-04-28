/**
 * list of LngLat stop points for a given stop index
 * includes:
 *  - previous stop target (if there is one)
 *  - stop target at given stop index
 *  - all route points at given stop index
 * @param {} index
 * @param {*} allStopPoints - collection of LngLat points
 * @param {*} allStopRoutes - collection of routes (each a collection of LngLat points) for a given stop
 * @returns list of LngLat points
 */
export default function getPointsForStop(
  index = 0,
  allStopPoints,
  allStopRoutes
) {
  const prevStopTarget = index > 0 ? allStopPoints[index - 1] : null;
  const currentStopRoute = allStopRoutes[index];
  const currentStopTarget = allStopPoints[index];

  // the list of points we want to create a bounding box around.
  return [prevStopTarget, ...currentStopRoute, currentStopTarget].filter(
    Boolean
  ); // remove any null values
}
