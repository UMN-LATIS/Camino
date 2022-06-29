import { LngLat, TourStopRoute, Maybe } from "@/types";
import lngLatEquals from "./lngLatEquals";

/**
 * tour route will begin with previous target point and end with current target point. Duplicate points and null values will be removed.
 */
export default function normalizeTourStopRoute(
  startPoint: Maybe<LngLat>,
  route: Maybe<LngLat[]>,
  targetPoint: Maybe<LngLat>
): TourStopRoute {
  return [startPoint, ...(route ?? []), targetPoint]
    .filter((x): x is LngLat => Boolean(x))
    .reduce((acc, curr, index, lnglats) => {
      if (index === 0) {
        return [...acc, curr];
      }
      return lngLatEquals(curr, lnglats[index - 1]) ? acc : [...acc, curr];
    }, [] as LngLat[]);
}
