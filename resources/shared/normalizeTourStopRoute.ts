import { LngLat, TourStopRoute } from "@/types";
import lngLatEquals from "./lngLatEquals";

/**
 * tour route will begin with previous target point and end with current target point. Duplicate points will be removed.
 */
export default function normalizeTourStopRoute(
  startPoint: LngLat,
  route: LngLat[],
  targetPoint: LngLat
): TourStopRoute {
  return [startPoint, ...route, targetPoint].reduce(
    (acc, curr, index, lnglats) => {
      if (index === 0) {
        return [...acc, curr];
      }
      return lngLatEquals(curr, lnglats[index - 1]) ? acc : [...acc, curr];
    },
    [] as LngLat[]
  );
}
