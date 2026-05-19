import type { LngLat } from "@/types";
import lngLatEquals from "@/shared/lngLatEquals";

/**
 * Strips the start/end anchors from a drawn polyline to recover
 * the interior waypoints.
 *
 * Why this exists: when the user edits a polyline through Mapbox
 * Draw, the resulting LineString carries every vertex — including
 * the locked endpoints we set as the start and end anchors.
 * Downstream callers of the editor want only the interior; the
 * endpoints are already known from props.
 *
 * Match-by-value is defensive: mapbox-gl-draw-waypoint locks the
 * endpoints under normal use, so the first and last drawn
 * coordinates should equal `startPoint` and `endPoint`. If they
 * don't (different draw lib, a bug, a degenerate edit), we treat
 * the unmatched ends as interior data and preserve them rather
 * than silently dropping points.
 */
export default function stripAnchors(
  drawnLine: LngLat[],
  startPoint: LngLat,
  endPoint: LngLat,
): LngLat[] {
  if (drawnLine.length === 0) return [];

  const headIsStart = lngLatEquals(drawnLine[0], startPoint);
  const tailIsEnd = lngLatEquals(drawnLine[drawnLine.length - 1], endPoint);

  const startIdx = headIsStart ? 1 : 0;
  const endIdx = tailIsEnd ? drawnLine.length - 1 : drawnLine.length;
  if (startIdx >= endIdx) return [];

  return drawnLine.slice(startIdx, endIdx);
}
