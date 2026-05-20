/** Drawn polyline → canonical interior-only waypoint list. */

import { describe, it, expect } from "vitest";
import stripAnchors from "./stripAnchors";
import { P } from "@/shared/__fixtures__/tour";

describe("stripAnchors", () => {
  it("returns [] for an empty drawn line", () => {
    expect(stripAnchors([], P.origin, P.firstTarget)).toEqual([]);
  });

  it("returns [] when the drawn line is just [start, end]", () => {
    expect(
      stripAnchors([P.origin, P.firstTarget], P.origin, P.firstTarget),
    ).toEqual([]);
  });

  it("strips locked endpoints, returning interior waypoints", () => {
    expect(
      stripAnchors(
        [P.origin, P.waypointA, P.waypointB, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA, P.waypointB]);
  });

  it("preserves a head that doesn't match the start anchor", () => {
    expect(
      stripAnchors(
        [P.outlier, P.waypointA, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.outlier, P.waypointA]);
  });

  it("preserves a tail that doesn't match the end anchor", () => {
    expect(
      stripAnchors([P.origin, P.waypointA, P.outlier], P.origin, P.firstTarget),
    ).toEqual([P.waypointA, P.outlier]);
  });

  it("returns [] when stripping both ends leaves a negative slice", () => {
    expect(stripAnchors([P.origin], P.origin, P.firstTarget)).toEqual([]);
  });

  it("dedupes consecutive duplicate waypoints", () => {
    expect(
      stripAnchors(
        [P.origin, P.waypointA, P.waypointA, P.waypointB, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA, P.waypointB]);
  });

  it("collapses duplicate bookends at both ends", () => {
    expect(
      stripAnchors(
        [P.origin, P.origin, P.waypointA, P.firstTarget, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA]);
  });

  it("dedupes a waypoint that coincides with an adjacent anchor", () => {
    expect(
      stripAnchors(
        [P.origin, P.origin, P.waypointA, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA]);
  });
});
