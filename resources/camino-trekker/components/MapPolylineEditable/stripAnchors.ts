import type { LngLat } from "@/types";
import normalizeTourStopRoute from "@/shared/normalizeTourStopRoute";

/**
 * Cleans up a drawn polyline into the canonical interior-only
 * waypoint list.
 *
 * Three things happen, in one pass:
 *
 *   1. Endpoint stripping. The line is sandwiched with the known
 *      `startPoint` and `endPoint` and then deduped, so any drawn
 *      bookend that already matches an anchor collapses away.
 *      Duplicate bookends (`[start, start, …]`) collapse too.
 *
 *   2. Consecutive deduplication. Dragging a vertex onto an
 *      adjacent one — or any other edit that produces identical
 *      neighbors — leaves redundant points. Drop them.
 *
 *   3. Endpoints removed. After (1) and (2) we slice off the
 *      bookends, leaving only the interior waypoints the editor
 *      actually owns.
 *
 * If Mapbox somehow emits a drawn line whose head/tail doesn't
 * equal the known anchors (e.g., a future draw lib that allows
 * dragging endpoints), the unmatched ends survive as interior data
 * — no silent point loss.
 */
export default function stripAnchors(
  drawnLine: LngLat[],
  startPoint: LngLat,
  endPoint: LngLat,
): LngLat[] {
  const normalized = normalizeTourStopRoute(startPoint, drawnLine, endPoint);
  return normalized.slice(1, -1);
}
