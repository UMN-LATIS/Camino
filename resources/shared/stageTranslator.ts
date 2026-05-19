/**
 * The JIT parser for navigation stages coming off the wire.
 *
 * Legacy wire shape:  `{ route: [start, ...interior, target], targetPoint }`
 * Canonical shape:    `{ waypoints: [...interior], targetPoint }`
 *
 * `fromLegacyNavStage` returns a stage with `waypoints` populated.
 * It handles three cases:
 *
 *   1. Already-new-shape input (`waypoints` already set) — pass
 *      through unchanged.
 *   2. Legacy input where `route`'s endpoints match the derived
 *      start and stored `targetPoint` — strip the endpoints.
 *   3. Legacy input where `route` doesn't look bookended — trust
 *      the stored array as interior waypoints.
 *
 * Consecutive duplicate points in legacy data get deduped on the
 * way out. This is the only place the parser is intentionally
 * lossy, and it cleans up bad data we know exists.
 *
 * There is no `toLegacyNavStage`. The migration is one-way: once
 * a tour is read through this function and saved, it'll be in the
 * new shape on disk.
 */

import { type NavigationStage, type LngLat, type Maybe } from "@/types";
import lngLatEquals from "./lngLatEquals";

export function fromLegacyNavStage(
  stage: NavigationStage,
  derivedStart: Maybe<LngLat>,
): NavigationStage {
  // Already in the new shape — trust `waypoints` and ignore whatever
  // legacy `route` might still be hanging around.
  if (stage.waypoints) {
    return { ...stage, waypoints: stage.waypoints };
  }

  const route = stage.route ?? [];
  const interior = stripBookends(route, derivedStart, stage.targetPoint);
  return { ...stage, waypoints: dedupeConsecutive(interior) };
}

/**
 * Returns the interior slice of a legacy `route` array — the points
 * that aren't a bookend matching the derived start or stored target.
 * Bookends are stripped one at a time from each end, only if they
 * match. A stored route that doesn't look bookended is treated as
 * already-interior data.
 */
function stripBookends(
  route: LngLat[],
  derivedStart: Maybe<LngLat>,
  targetPoint: Maybe<LngLat>,
): LngLat[] {
  if (route.length === 0) return [];

  const startMatches =
    derivedStart !== null && lngLatEquals(route[0], derivedStart);
  const endMatches =
    targetPoint !== null &&
    route.length > 0 &&
    lngLatEquals(route[route.length - 1], targetPoint);

  const startIndex = startMatches ? 1 : 0;
  const endIndex = endMatches ? route.length - 1 : route.length;

  // Guard against `[start]` stripping into a negative slice.
  if (startIndex >= endIndex) return [];

  return route.slice(startIndex, endIndex);
}

function dedupeConsecutive(points: LngLat[]): LngLat[] {
  return points.filter(
    (point, index) => index === 0 || !lngLatEquals(point, points[index - 1]),
  );
}
