/** Canonicalizes a stored `route` into the interior-only shape. Idempotent. */

import { type LngLat, type Maybe } from "@/types";
import lngLatEquals from "./lngLatEquals";

export default function cleanNavStageRoute(
  route: Maybe<LngLat[]>,
  derivedStart: Maybe<LngLat>,
  targetPoint: Maybe<LngLat>,
): LngLat[] {
  if (!route || route.length === 0) return [];

  // Dedupe first so a [start, start, ...] bookend doesn't hide its match from the strip.
  const deduped = route.filter(
    (point, index) => index === 0 || !lngLatEquals(point, route[index - 1]),
  );

  const headMatches =
    derivedStart !== null && lngLatEquals(deduped[0], derivedStart);
  const tailMatches =
    targetPoint !== null &&
    lngLatEquals(deduped[deduped.length - 1], targetPoint);

  const startIndex = headMatches ? 1 : 0;
  const endIndex = tailMatches ? deduped.length - 1 : deduped.length;

  if (startIndex >= endIndex) return [];

  return deduped.slice(startIndex, endIndex);
}
