import { Tour, TourStopRoute, Maybe } from "@/types";
import { getStopPolyline } from "@/shared/tourGeometry";

/**
 * The polyline to render for a stop in the trekker map.
 *
 * Delegates to the canonical `getStopPolyline` derivation:
 * `[derivedStart, ...waypoints, targetPoint]`. The endpoints come
 * from neighboring stops, not from the stored `route` array — so
 * we never duplicate bookends, and a mutation to a prior stop's
 * `targetPoint` is reflected here on the next read.
 */
export function getStopRouteByIndex(
  tour: Maybe<Tour>,
  index: number,
): TourStopRoute {
  if (!tour) return [];
  return getStopPolyline(tour, index);
}
