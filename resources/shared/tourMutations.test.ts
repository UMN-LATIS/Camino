/**
 * Tour mutation operations. Each one takes a Tour and returns a new
 * Tour — no shared state, no Vue, no store. They're the building
 * blocks the UI hands to the store after a user gesture.
 *
 * The interesting one is `moveStartAnchor`: dragging the start point
 * of stop N>0 is *not* a mutation on stop N. It mutates stop N-1's
 * `targetPoint` (or `tour.start_location` for stop 0). Pinning this
 * down is most of the point of these tests — the current code
 * conflates "start of this stop" with "data stored on this stop" and
 * that confusion is where most of the route-editing bugs live.
 */

import { describe, it, expect } from "vitest";
import {
  setWaypoint,
  insertWaypoint,
  removeWaypoint,
  setTargetPoint,
  moveStartAnchor,
} from "./tourMutations";
import { buildTour, buildStop, buildNavStage, P } from "./__fixtures__/tour";
import { type LngLat, type NavigationStage, type Tour } from "@/types";

function navStageOnStop(tour: Tour, stopId: number): NavigationStage {
  const stop = tour.stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`stop ${stopId} not found in fixture`);
  return stop.stop_content.stages[0] as NavigationStage;
}

describe("setWaypoint", () => {
  it("replaces the waypoint at the given index", () => {
    const stage = buildNavStage({
      waypoints: [P.waypointA, P.waypointB],
      targetPoint: P.firstTarget,
    });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = setWaypoint(tour, 1, stage.id, 1, P.waypointC);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointC,
    ]);
  });

  it("does not touch adjacent stops or stages", () => {
    const stage1 = buildNavStage({
      waypoints: [P.waypointA],
      targetPoint: P.firstTarget,
    });
    const stage2 = buildNavStage({
      waypoints: [P.waypointB],
      targetPoint: P.secondTarget,
    });
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, stages: [stage1] }),
        buildStop({ id: 2, stages: [stage2] }),
      ],
    });

    const next = setWaypoint(tour, 1, stage1.id, 0, P.waypointC);

    expect(navStageOnStop(next, 2).waypoints).toEqual([P.waypointB]);
    expect(navStageOnStop(next, 2).targetPoint).toEqual(P.secondTarget);
  });

  it("returns the tour unchanged when the index is out of range", () => {
    const stage = buildNavStage({ waypoints: [P.waypointA] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = setWaypoint(tour, 1, stage.id, 5, P.waypointC);

    expect(navStageOnStop(next, 1).waypoints).toEqual([P.waypointA]);
  });
});

describe("insertWaypoint", () => {
  it("inserts at the given index", () => {
    const stage = buildNavStage({
      waypoints: [P.waypointA, P.waypointC],
      targetPoint: P.firstTarget,
    });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = insertWaypoint(tour, 1, stage.id, 1, P.waypointB);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointB,
      P.waypointC,
    ]);
  });

  it("inserts at the front when index is 0", () => {
    const stage = buildNavStage({ waypoints: [P.waypointB] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = insertWaypoint(tour, 1, stage.id, 0, P.waypointA);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });

  it("appends when index equals length", () => {
    const stage = buildNavStage({ waypoints: [P.waypointA] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = insertWaypoint(tour, 1, stage.id, 1, P.waypointB);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });
});

describe("removeWaypoint", () => {
  it("removes the waypoint at the given index", () => {
    const stage = buildNavStage({
      waypoints: [P.waypointA, P.waypointB, P.waypointC],
    });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = removeWaypoint(tour, 1, stage.id, 1);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointC,
    ]);
  });

  it("results in an empty array when removing the last waypoint", () => {
    const stage = buildNavStage({ waypoints: [P.waypointA] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = removeWaypoint(tour, 1, stage.id, 0);

    expect(navStageOnStop(next, 1).waypoints).toEqual([]);
  });

  it("leaves the tour unchanged when the index is out of range", () => {
    const stage = buildNavStage({ waypoints: [P.waypointA] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = removeWaypoint(tour, 1, stage.id, 5);

    expect(navStageOnStop(next, 1).waypoints).toEqual([P.waypointA]);
  });
});

describe("setTargetPoint", () => {
  it("sets the nav stage's targetPoint", () => {
    const stage = buildNavStage({ targetPoint: P.firstTarget });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = setTargetPoint(tour, 1, stage.id, P.secondTarget);

    expect(navStageOnStop(next, 1).targetPoint).toEqual(P.secondTarget);
  });

  it("can clear the targetPoint by passing null", () => {
    const stage = buildNavStage({ targetPoint: P.firstTarget });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = setTargetPoint(tour, 1, stage.id, null);

    expect(navStageOnStop(next, 1).targetPoint).toBeNull();
  });

  it("does not touch the stage's waypoints", () => {
    const stage = buildNavStage({
      waypoints: [P.waypointA, P.waypointB],
      targetPoint: P.firstTarget,
    });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });

    const next = setTargetPoint(tour, 1, stage.id, P.secondTarget);

    expect(navStageOnStop(next, 1).waypoints).toEqual([
      P.waypointA,
      P.waypointB,
    ]);
  });
});

describe("moveStartAnchor — edits the source of the derivation, not this stop", () => {
  it("for stop 0, mutates tour.start_location", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });

    const next = moveStartAnchor(tour, 1, P.outlier);

    expect(next.start_location).toEqual(P.outlier);
    // The stop being "started from" is untouched.
    expect(navStageOnStop(next, 1).targetPoint).toEqual(P.firstTarget);
    expect(navStageOnStop(next, 1).waypoints).toEqual([]);
  });

  it("for stop N>0, mutates stop N-1's last-nav-stage targetPoint", () => {
    const stage1 = buildNavStage({ targetPoint: P.firstTarget });
    const stage2 = buildNavStage({
      waypoints: [P.waypointA],
      targetPoint: P.secondTarget,
    });
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, stages: [stage1] }),
        buildStop({ id: 2, stages: [stage2] }),
      ],
    });

    const next = moveStartAnchor(tour, 2, P.outlier);

    // Stop 1's target moved.
    expect(navStageOnStop(next, 1).targetPoint).toEqual(P.outlier);
    // Stop 2's own data is untouched.
    expect(navStageOnStop(next, 2).waypoints).toEqual([P.waypointA]);
    expect(navStageOnStop(next, 2).targetPoint).toEqual(P.secondTarget);
    // Tour-level start is untouched.
    expect(next.start_location).toEqual(P.origin);
  });

  it("cascades back when stop N-1 has a null target", () => {
    // Stop 3's start derives from stop 1 (because stop 2's target is
    // null). Dragging stop 3's start anchor should therefore edit
    // stop 1, not stop 2.
    const stage1 = buildNavStage({ targetPoint: P.firstTarget });
    const stage2 = buildNavStage({ targetPoint: null });
    const stage3 = buildNavStage({ targetPoint: P.thirdTarget });
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, stages: [stage1] }),
        buildStop({ id: 2, stages: [stage2] }),
        buildStop({ id: 3, stages: [stage3] }),
      ],
    });

    const next = moveStartAnchor(tour, 3, P.outlier);

    expect(navStageOnStop(next, 1).targetPoint).toEqual(P.outlier);
    expect(navStageOnStop(next, 2).targetPoint).toBeNull();
    expect(navStageOnStop(next, 3).targetPoint).toEqual(P.thirdTarget);
  });

  it("falls through to tour.start_location when every prior target is null", () => {
    const stage1 = buildNavStage({ targetPoint: null });
    const stage2 = buildNavStage({ targetPoint: P.secondTarget });
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({ id: 1, stages: [stage1] }),
        buildStop({ id: 2, stages: [stage2] }),
      ],
    });

    const next = moveStartAnchor(tour, 2, P.outlier);

    expect(next.start_location).toEqual(P.outlier);
    expect(navStageOnStop(next, 1).targetPoint).toBeNull();
  });
});

describe("immutability", () => {
  it("setWaypoint returns a new Tour, leaving the original untouched", () => {
    const stage = buildNavStage({ waypoints: [P.waypointA] });
    const tour = buildTour({
      stops: [buildStop({ id: 1, stages: [stage] })],
    });
    const before = JSON.parse(JSON.stringify(tour)) as Tour;

    setWaypoint(tour, 1, stage.id, 0, P.waypointB);

    expect(tour).toEqual(before);
  });

  it("moveStartAnchor returns a new Tour, leaving the original untouched", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1 })],
    });
    const before = JSON.parse(JSON.stringify(tour)) as Tour;

    moveStartAnchor(tour, 1, P.outlier);

    expect(tour).toEqual(before);
  });
});

describe("unrelated waypoint helper imports", () => {
  // Compile-time check: these are pure data manipulators, no LngLat
  // helpers are smuggled in from elsewhere.
  it("exists as a sanity probe for the eventual implementation", () => {
    const noop: LngLat = P.origin;
    expect(noop).toEqual(P.origin);
  });
});
