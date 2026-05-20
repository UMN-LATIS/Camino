import { describe, it, expect } from "vitest";
import reconcileTour from "./reconcileTour";
import { buildTour, buildStop, Points } from "./__fixtures__/tour";
import {
  type NavigationStage,
  type LngLat,
  type Tour,
  StageType,
  Locale,
} from "@/types";

function getNavStage(tour: Tour, stopId: number): NavigationStage {
  const stop = tour.stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`stop ${stopId} missing from reconciled tour`);
  const stage = stop.stop_content.stages.find(
    (s): s is NavigationStage => s.type === StageType.Navigation,
  );
  if (!stage) throw new Error(`stop ${stopId} has no nav stage`);
  return stage;
}

function stopWithWaypoints(
  id: number,
  waypoints: LngLat[],
  targetPoint: NavigationStage["targetPoint"],
) {
  return buildStop({
    id,
    stages: [
      {
        id: `nav-${id}`,
        type: StageType.Navigation,
        text: { [Locale.en]: "" },
        waypoints,
        targetPoint,
      } satisfies NavigationStage,
    ],
  });
}

describe("reconcileTour — fills in missing targetPoints", () => {
  it("offsets from the derived start when a stage has no target", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithWaypoints(1, [], null)],
    });

    const stage = getNavStage(reconcileTour(tour), 1);
    expect(stage.targetPoint).not.toBeNull();
    expect(stage.targetPoint).not.toEqual(Points.origin);
  });

  it("keeps a defined targetPoint as-is", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithWaypoints(1, [], Points.firstTarget)],
    });

    expect(getNavStage(reconcileTour(tour), 1).targetPoint).toEqual(
      Points.firstTarget,
    );
  });

  it("uses the prior stop's targetPoint as the derived start", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(1, [], Points.firstTarget),
        stopWithWaypoints(
          2,
          [Points.firstTarget, Points.waypointC, Points.secondTarget],
          Points.secondTarget,
        ),
      ],
    });

    // Stop 2's derived start = stop 1's targetPoint = firstTarget.
    // The bookend matching firstTarget gets stripped from waypoints.
    expect(getNavStage(reconcileTour(tour), 2).waypoints).toEqual([
      Points.waypointC,
    ]);
  });
});

describe("reconcileTour — `waypoints` is interior-only", () => {
  it("strips a leading point that matches the derived start", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.origin, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
    ]);
  });

  it("strips a trailing point that matches the targetPoint", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.waypointA, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
    ]);
  });

  it("strips both bookends when both match", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
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

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
      Points.waypointB,
    ]);
  });

  it("leaves waypoints alone when neither end matches an anchor", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.outlier, Points.waypointA, Points.waypointB],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.outlier,
      Points.waypointA,
      Points.waypointB,
    ]);
  });
});

describe("reconcileTour — `waypoints` has no consecutive duplicates", () => {
  it("collapses an interior point repeated against itself", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.waypointA, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
    ]);
  });

  it("collapses a duplicated start bookend (start, start, …)", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.origin, Points.origin, Points.waypointA],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
    ]);
  });

  it("collapses a duplicated end bookend (…, target, target)", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.waypointA, Points.firstTarget, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([
      Points.waypointA,
    ]);
  });
});

describe("reconcileTour — is idempotent", () => {
  it("re-running on already-reconciled output is a no-op", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
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

    const once = reconcileTour(tour);
    const twice = reconcileTour(once);

    expect(getNavStage(once, 1).waypoints).toEqual([Points.waypointA]);
    expect(getNavStage(twice, 1).waypoints).toEqual(
      getNavStage(once, 1).waypoints,
    );
  });

  it("emits `[]` (not null) when the waypoints array is empty", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithWaypoints(1, [], Points.firstTarget)],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([]);
  });

  it("emits `[]` when stripping both bookends leaves nothing", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(
          1,
          [Points.origin, Points.firstTarget],
          Points.firstTarget,
        ),
      ],
    });

    expect(getNavStage(reconcileTour(tour), 1).waypoints).toEqual([]);
  });
});

describe("reconcileTour — multi-stop isolation", () => {
  it("keeps each stop's waypoints isolated from its neighbors", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithWaypoints(1, [Points.waypointA], Points.firstTarget),
        stopWithWaypoints(2, [Points.waypointB], Points.secondTarget),
        stopWithWaypoints(3, [Points.waypointC], Points.thirdTarget),
      ],
    });

    const reconciled = reconcileTour(tour);
    expect(getNavStage(reconciled, 1).waypoints).toEqual([Points.waypointA]);
    expect(getNavStage(reconciled, 2).waypoints).toEqual([Points.waypointB]);
    expect(getNavStage(reconciled, 3).waypoints).toEqual([Points.waypointC]);
  });
});
