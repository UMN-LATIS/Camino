/** `normalizeTour` behavior: targetPoint fill-in, cascade, and per-stop isolation. */

import { describe, it, expect } from "vitest";
import normalizeTour from "./normalizeTour";
import { buildTour, buildStop, P } from "./__fixtures__/tour";
import {
  type NavigationStage,
  type LngLat,
  type Tour,
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

describe("normalizeTour — fills in missing targetPoints", () => {
  it("offsets from the derived start when a stage has no target", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [], null)],
    });

    const stage = navStage(normalizeTour(tour), 1);
    expect(stage.targetPoint).not.toBeNull();
    expect(stage.targetPoint).not.toEqual(P.origin);
  });

  it("keeps a defined targetPoint as-is", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [stopWithRoute(1, [], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).targetPoint).toEqual(P.firstTarget);
  });
});

describe("normalizeTour — cascade and isolation", () => {
  it("keeps each stop's route isolated from its neighbors", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        stopWithRoute(1, [P.waypointA], P.firstTarget),
        stopWithRoute(2, [P.waypointB], P.secondTarget),
        stopWithRoute(3, [P.waypointC], P.thirdTarget),
      ],
    });

    const normalized = normalizeTour(tour);
    expect(navStage(normalized, 1).route).toEqual([P.waypointA]);
    expect(navStage(normalized, 2).route).toEqual([P.waypointB]);
    expect(navStage(normalized, 3).route).toEqual([P.waypointC]);
  });

  it("uses the prior stop's targetPoint as the derived start", () => {
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
});
