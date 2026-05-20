/** Canonicalizes stored waypoints into the interior-only shape. Idempotent. */

import { type LngLat, type Maybe } from "@/types";
import lngLatEquals from "./lngLatEquals";

function withoutConsecutiveDuplicates(points: LngLat[]): LngLat[] {
  return points.filter(
    (point, i) => i === 0 || !lngLatEquals(point, points[i - 1]),
  );
}

interface CleanNavStageWaypointsArgs {
  waypoints: Maybe<LngLat[]>;
  start: LngLat;
  end: LngLat;
}

/**
 * Bracket the waypoints with their anchors, dedupe consecutive duplicates, then
 * drop the anchors. A leading point matching `start` (or trailing matching
 * `end`) becomes a consecutive duplicate of its anchor and gets collapsed; the
 * final `slice(1, -1)` removes the anchors themselves.
 */
export default function cleanNavStageWaypoints({
  waypoints,
  start,
  end,
}: CleanNavStageWaypointsArgs): LngLat[] {
  return withoutConsecutiveDuplicates([start, ...(waypoints ?? []), end]).slice(
    1,
    -1,
  );
}
