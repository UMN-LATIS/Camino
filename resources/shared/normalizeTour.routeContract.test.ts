/**
 * Contract tests for `NavigationStage.route` after `normalizeTour`:
 * interior-only (no derived start, no targetPoint), no consecutive
 * duplicates, idempotent.
 */

import { describe, it, expect } from "vitest";
import normalizeTour from "./normalizeTour";
import { buildTour, buildStop, P } from "./__fixtures__/tour";
import {
  type NavigationStage,
  type Tour,
  type LngLat,
  StageType,
  Locale,
} from "@/types";

function navStage(tour: Tour, stopId: number): NavigationStage {
  const stop = tour.stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`stop ${stopId} missing from normalized tour`);
  const stage = stop.stop_content.stages.find(
    (s) => s.type === StageType.Navigation,
  );
  if (!stage) throw new Error(`stop ${stopId} has no nav stage`);
  return stage as NavigationStage;
}

/** Build a stop whose sole nav stage carries the given raw `route`. */
function stopWithRoute(
  id: number,
  route: LngLat[],
  targetPoint: NavigationStage["targetPoint"],
) {
  return buildStop({
    id,
    stages: [
      {
        id: `nav-${id}`,
        type: StageType.Navigation,
        text: { [Locale.en]: "" },
        route,
        targetPoint,
      } satisfies NavigationStage,
    ],
  });
}

describe("normalizeTour — `route` is interior-only", () => {
  it("strips a leading point that matches the derived start", () => {
    // Stop 1's derived start is tour.start_location (P.origin).
    // A stored route that begins with P.origin is legacy bookended
    // data; the leading anchor must be removed.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [P.origin, P.waypointA], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });

  it("strips a trailing point that matches the targetPoint", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [P.waypointA, P.firstTarget], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });

  it("strips both bookends when both match", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(
          1,
          [P.origin, P.waypointA, P.waypointB, P.firstTarget],
          P.firstTarget,
        ),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });

  it("uses the prior stop's targetPoint as the derived start for stop N>0", () => {
    // Stop 2's derived start is stop 1's targetPoint (P.firstTarget).
    // A stored route on stop 2 that begins with P.firstTarget is
    // bookended legacy data and must lose that leading point.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(1, [], P.firstTarget),
        stopWithRoute(
          2,
          [P.firstTarget, P.waypointC, P.secondTarget],
          P.secondTarget,
        ),
      ],
    });

    expect(navStage(normalizeTour(tour), 2).route).toEqual([P.waypointC]);
  });

  it("leaves a route alone when neither end matches an anchor", () => {
    // If the head doesn't equal the derived start and the tail
    // doesn't equal the targetPoint, the points are interior data —
    // don't drop them.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(1, [P.outlier, P.waypointA, P.waypointB], P.firstTarget),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([
      P.outlier,
      P.waypointA,
      P.waypointB,
    ]);
  });
});

describe("normalizeTour — `route` has no consecutive duplicates", () => {
  it("collapses an interior point repeated against itself", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [P.waypointA, P.waypointA], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });

  it("collapses a duplicated start bookend (start, start, …)", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(1, [P.origin, P.origin, P.waypointA], P.firstTarget),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });

  it("collapses a duplicated end bookend (…, target, target)", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(
          1,
          [P.waypointA, P.firstTarget, P.firstTarget],
          P.firstTarget,
        ),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });

  it("collapses a waypoint that coincides with an adjacent anchor", () => {
    // User drags an interior point onto the start anchor — the
    // stored route has the start anchor present twice in a row.
    // After cleanup both copies of the anchor are gone.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(1, [P.origin, P.origin, P.waypointA], P.firstTarget),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([P.waypointA]);
  });
});

describe("normalizeTour — `route` is idempotent and well-shaped", () => {
  it("passes through an already-clean (interior-only) route unchanged", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [P.waypointA, P.waypointB], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });

  it("normalizes twice to the same result", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(
          1,
          [P.origin, P.waypointA, P.waypointA, P.firstTarget],
          P.firstTarget,
        ),
      ],
    });

    const once = normalizeTour(tour);
    const twice = normalizeTour(once);

    expect(navStage(once, 1).route).toEqual([P.waypointA]);
    expect(navStage(twice, 1).route).toEqual(navStage(once, 1).route);
  });

  it("emits `[]` (not null) when the route is empty", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([]);
  });

  it("emits `[]` when stripping both bookends leaves nothing", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [P.origin, P.firstTarget], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([]);
  });
});
