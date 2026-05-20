import type { LngLat } from "@/types";
import normalizeTourStopRoute from "@/shared/normalizeTourStopRoute";

/** Strips known anchors and consecutive duplicates from a drawn polyline, returning interior waypoints only. */
export default function stripAnchors(
  drawnLine: LngLat[],
  startPoint: LngLat,
  endPoint: LngLat,
): LngLat[] {
  const normalized = normalizeTourStopRoute(startPoint, drawnLine, endPoint);
  return normalized.slice(1, -1);
}
