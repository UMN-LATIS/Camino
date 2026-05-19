/**
 * The pure helper that turns a drawn polyline back into the
 * canonical interior-only waypoint list. This is the load-bearing
 * piece of MapPolylineEditable's `update:waypoints` contract —
 * everything else in the component is plumbing around Mapbox Draw.
 */

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
    // Defensive: if a future draw lib stops locking endpoints, an
    // unmatched head is interior data and must not be dropped.
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
    // A single point that happens to equal the start gets stripped
    // away entirely — there's nothing left to be interior.
    expect(stripAnchors([P.origin], P.origin, P.firstTarget)).toEqual([]);
  });

  it("dedupes consecutive duplicate waypoints", () => {
    // Some Mapbox edit operations (especially dragging a vertex
    // onto an adjacent one) leave behind interior duplicates.
    // Clean them up at the boundary so the canonical waypoint
    // list stays minimal.
    expect(
      stripAnchors(
        [P.origin, P.waypointA, P.waypointA, P.waypointB, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA, P.waypointB]);
  });

  it("collapses duplicate bookends at both ends", () => {
    // Defensive: if the drawn line somehow has the anchor
    // duplicated against itself, strip both copies. Dedupe + strip
    // composed once gives the right result.
    expect(
      stripAnchors(
        [P.origin, P.origin, P.waypointA, P.firstTarget, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA]);
  });

  it("dedupes a waypoint that coincides with an adjacent anchor", () => {
    // If a user drags an interior waypoint onto the start anchor,
    // the drawn line has the start point twice in a row. After
    // cleanup the extra interior copy is gone.
    expect(
      stripAnchors(
        [P.origin, P.origin, P.waypointA, P.firstTarget],
        P.origin,
        P.firstTarget,
      ),
    ).toEqual([P.waypointA]);
  });
});
