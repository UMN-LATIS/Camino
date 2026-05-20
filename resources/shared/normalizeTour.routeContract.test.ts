import { describe, it, expect } from "vitest";
import normalizeTour from "./normalizeTour";
import { buildTour, buildStop, Points } from "./__fixtures__/tour";
import {
  type NavigationStage,
  type Tour,
  type LngLat,
  StageType,
  Locale,
} from "@/types";

function getNavStage(tour: Tour, stopId: number): NavigationStage {
  const stop = tour.stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`stop ${stopId} missing from normalized tour`);
  const stage = stop.stop_content.stages.find(
    (s): s is NavigationStage => s.type === StageType.Navigation,
  );
  if (!stage) throw new Error(`stop ${stopId} has no nav stage`);
  return stage;
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
      startLocation: Points.origin,
      stops: [
        stopWithRoute(1, [Points.origin, Points.waypointA], Points.firstTarget),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });

  it("strips a trailing point that matches the targetPoint", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.waypointA, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });

  it("strips both bookends when both match", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [
            Points.origin,
            Points.waypointA,
            Points.waypointB,
            Points.firstTarget,
          ],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
      Points.waypointB,
    ]);
  });

  it("uses the prior stop's targetPoint as the derived start for stop N>0", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(1, [], Points.firstTarget),
        stopWithRoute(
          2,
          [Points.firstTarget, Points.waypointC, Points.secondTarget],
          Points.secondTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 2).route).toEqual([
      Points.waypointC,
    ]);
  });

  it("leaves a route alone when neither end matches an anchor", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.outlier, Points.waypointA, Points.waypointB],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.outlier,
      Points.waypointA,
      Points.waypointB,
    ]);
  });
});

describe("normalizeTour — `route` has no consecutive duplicates", () => {
  it("collapses an interior point repeated against itself", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.waypointA, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });

  it("collapses a duplicated start bookend (start, start, …)", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.origin, Points.origin, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });

  it("collapses a duplicated end bookend (…, target, target)", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.waypointA, Points.firstTarget, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });

  it("collapses a waypoint that coincides with an adjacent anchor", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.origin, Points.origin, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
    ]);
  });
});

describe("normalizeTour — `route` is idempotent and well-shaped", () => {
  it("passes through an already-clean (interior-only) route unchanged", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.waypointA, Points.waypointB],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([
      Points.waypointA,
      Points.waypointB,
    ]);
  });

  it("normalizes twice to the same result", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [
            Points.origin,
            Points.waypointA,
            Points.waypointA,
            Points.firstTarget,
          ],
          Points.firstTarget,
        ),
      ],
    });

    const once = normalizeTour(tour);
    const twice = normalizeTour(once);

    expect(getNavStage(once, 1).route).toEqual([Points.waypointA]);
    expect(getNavStage(twice, 1).route).toEqual(getNavStage(once, 1).route);
  });

  it("emits `[]` (not null) when the route is empty", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithRoute(1, [], Points.firstTarget)],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([]);
  });

  it("emits `[]` when stripping both bookends leaves nothing", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(
          1,
          [Points.origin, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(normalizeTour(tour), 1).route).toEqual([]);
  });
});
