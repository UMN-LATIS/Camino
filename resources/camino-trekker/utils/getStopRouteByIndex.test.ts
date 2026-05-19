/**
 * `getStopRouteByIndex` returns the polyline to draw for a given
 * stop in the trekker map. Under the new geometry model that's
 * simply `getStopPolyline(tour, index)` — the trekker shouldn't
 * be re-bookending endpoints onto data that's already in canonical
 * form.
 *
 * These tests pin the contract from the caller's perspective:
 *
 *   • `[derivedStart, ...waypoints, target]` in order.
 *   • No duplicate bookends.
 *   • Stop 0's start comes from `tour.start_location`; later
 *     stops cascade back through prior `targetPoint`s.
 */

import { describe, it, expect } from "vitest";
import { getStopRouteByIndex } from "./getStopRouteByIndex";
import { buildTour, buildStop, P } from "@/shared/__fixtures__/tour";

describe("getStopRouteByIndex", () => {
  it("returns an empty array when tour is null", () => {
    expect(getStopRouteByIndex(null, 0)).toEqual([]);
  });

  it("returns [start, target] when the stop has no waypoints", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([P.origin, P.firstTarget]);
  });

  it("interleaves waypoints between start and target", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({
          id: 1,
          waypoints: [P.waypointA, P.waypointB],
          targetPoint: P.firstTarget,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([
      P.origin,
      P.waypointA,
      P.waypointB,
      P.firstTarget,
    ]);
  });

  it("uses the prior stop's target as the start of a later stop", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({
          id: 2,
          waypoints: [P.waypointC],
          targetPoint: P.secondTarget,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 1)).toEqual([
      P.firstTarget,
      P.waypointC,
      P.secondTarget,
    ]);
  });

  it("does not duplicate the start or target at the bookends", () => {
    // This was the old behavior — re-prepending and re-appending
    // points that were already in the stage's `route`. The new
    // implementation derives endpoints from prior stops and never
    // touches the stored waypoint list.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({
          id: 1,
          waypoints: [P.waypointA],
          targetPoint: P.firstTarget,
        }),
      ],
    });
    const polyline = getStopRouteByIndex(tour, 0);
    expect(polyline.filter((p) => p === P.origin)).toHaveLength(1);
    expect(polyline.filter((p) => p === P.firstTarget)).toHaveLength(1);
  });
});
