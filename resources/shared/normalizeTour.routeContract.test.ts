/** Contract: `NavigationStage.route` post-normalize is interior-only, dedup'd, idempotent. */

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
