const isNavigationStage = (stage) => stage.type === "navigation";
const getNavStagesAtStop = (stop) =>
  stop.stop_content.stages.filter(isNavigationStage);
const getRoutesFromNavStages = (navStages) =>
  navStages.flatMap((navStage) => navStage.route);

export default (tour) => {
  // just a single point for stop 0
  // const startingRoute = [tour.start_location];
  const stopRoutes = tour.stops.map((stop) => {
    const navStages = getNavStagesAtStop(stop);
    const routes = getRoutesFromNavStages(navStages);
    return routes;
  });
  // return [startingRoute, ...stopRoutes];
  return stopRoutes;
};
