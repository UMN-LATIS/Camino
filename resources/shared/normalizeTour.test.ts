/**
 * Tests for the fetch-time normalizer. Pins two things:
 *
 *   1. Existing behavior — `route` is rewritten to
 *      `[start, ...interior, target]`, dedupes consecutive
 *      duplicates, falls back through prior stop targets when a
 *      target is missing.
 *
 *   2. New behavior — every navigation stage also gets `waypoints`
 *      populated with interior-only points. `waypoints` and `route`
 *      stay in sync so consumers can migrate one at a time without
 *      ever seeing a stale or contradictory pair.
 */

import { describe, it, expect } from "vitest";
import normalizeTour from "./normalizeTour";
import { buildTour, buildStop, P } from "./__fixtures__/tour";
import { type NavigationStage, type Tour, StageType, Locale } from "@/types";

function legacyStop(
  id: number,
  route: NavigationStage["route"],
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

function navStage(tour: Tour, stopId: number): NavigationStage {
  const stop = tour.stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`stop ${stopId} missing from normalized tour`);
  const stage = stop.stop_content.stages.find(
    (s) => s.type === StageType.Navigation,
  );
  if (!stage) throw new Error(`stop ${stopId} has no nav stage`);
  return stage as NavigationStage;
}

describe("normalizeTour — existing legacy `route` behavior", () => {
  it("rewrites a stage's route to start at the prior stop's target", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        legacyStop(1, [P.waypointA], P.firstTarget),
        legacyStop(2, [P.waypointB], P.secondTarget),
      ],
    });

    const normalized = normalizeTour(tour);

    // Stop 1's route starts at the tour's start_location.
    expect(navStage(normalized, 1).route?.[0]).toEqual(P.origin);
    // Stop 2's route starts at stop 1's target.
    expect(navStage(normalized, 2).route?.[0]).toEqual(P.firstTarget);
  });

  it("rewrites a stage's route to end at its targetPoint", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [legacyStop(1, [P.waypointA], P.firstTarget)],
    });

    const stage = navStage(normalizeTour(tour), 1);
    expect(stage.route?.[stage.route.length - 1]).toEqual(P.firstTarget);
  });

  it("preserves interior waypoints between the bookends", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [legacyStop(1, [P.waypointA, P.waypointB], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).route).toEqual([
      P.origin,
      P.waypointA,
      P.waypointB,
      P.firstTarget,
    ]);
  });
});

describe("normalizeTour — populates `waypoints` on every nav stage", () => {
  it("sets waypoints to [] when the legacy route has no interior points", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [legacyStop(1, [], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).waypoints).toEqual([]);
  });

  it("sets waypoints to the interior slice of the normalized route", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [legacyStop(1, [P.waypointA, P.waypointB], P.firstTarget)],
    });

    expect(navStage(normalizeTour(tour), 1).waypoints).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });

  it("strips bookends that legacy data already carries", () => {
    // Stored route already has its start/target prepended/appended
    // by an earlier normalize pass. After this pass, `waypoints`
    // should still be interior-only, not include the bookends.
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        legacyStop(1, [P.origin, P.waypointA, P.firstTarget], P.firstTarget),
      ],
    });

    expect(navStage(normalizeTour(tour), 1).waypoints).toEqual([P.waypointA]);
  });

  it("uses prior stop's target as the start anchor for waypoints math", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        legacyStop(1, [], P.firstTarget),
        legacyStop(2, [P.waypointC], P.secondTarget),
      ],
    });

    expect(navStage(normalizeTour(tour), 2).waypoints).toEqual([P.waypointC]);
  });

  it("keeps each stop's waypoints isolated from neighbors", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        legacyStop(1, [P.waypointA], P.firstTarget),
        legacyStop(2, [P.waypointB], P.secondTarget),
        legacyStop(3, [P.waypointC], P.thirdTarget),
      ],
    });

    const normalized = normalizeTour(tour);
    expect(navStage(normalized, 1).waypoints).toEqual([P.waypointA]);
    expect(navStage(normalized, 2).waypoints).toEqual([P.waypointB]);
    expect(navStage(normalized, 3).waypoints).toEqual([P.waypointC]);
  });
});
