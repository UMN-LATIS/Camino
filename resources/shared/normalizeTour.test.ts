import { describe, it, expect } from "vitest";
import normalizeTour from "./normalizeTour";
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

describe("normalizeTour — fills in missing targetPoints", () => {
  it("offsets from the derived start when a stage has no target", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithRoute(1, [], null)],
    });

    const stage = getNavStage(normalizeTour(tour), 1);
    expect(stage.targetPoint).not.toBeNull();
    expect(stage.targetPoint).not.toEqual(Points.origin);
  });

  it("keeps a defined targetPoint as-is", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [stopWithRoute(1, [], Points.firstTarget)],
    });

    expect(getNavStage(normalizeTour(tour), 1).targetPoint).toEqual(
      Points.firstTarget,
    );
  });
});

describe("normalizeTour — cascade and isolation", () => {
  it("keeps each stop's route isolated from its neighbors", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        stopWithRoute(1, [Points.waypointA], Points.firstTarget),
        stopWithRoute(2, [Points.waypointB], Points.secondTarget),
        stopWithRoute(3, [Points.waypointC], Points.thirdTarget),
      ],
    });

    const normalized = normalizeTour(tour);
    expect(getNavStage(normalized, 1).route).toEqual([Points.waypointA]);
    expect(getNavStage(normalized, 2).route).toEqual([Points.waypointB]);
    expect(getNavStage(normalized, 3).route).toEqual([Points.waypointC]);
  });

  it("uses the prior stop's targetPoint as the derived start", () => {
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
});
