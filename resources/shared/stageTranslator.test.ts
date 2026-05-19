/**
 * The JIT parser for navigation stages coming off the wire.
 *
 *   Legacy wire: `{ route: [start, ...interior, target], targetPoint }`
 *   Canonical:   `{ waypoints: [...interior], targetPoint }`
 *
 * `fromLegacyNavStage` strips the implicit start/target endpoints
 * off a stored `route` so callers see only interior `waypoints`. It
 * also handles stages already in the new shape — once tours start
 * saving in the new format, the wire payload will be a mix of both,
 * and this function is the only place that needs to know.
 *
 * There is no `toLegacyNavStage`. The migration is one-way: new
 * shape is the only shape we write going forward.
 */

import { describe, it, expect } from "vitest";
import { fromLegacyNavStage } from "./stageTranslator";
import { P } from "./__fixtures__/tour";
import { type NavigationStage, StageType, Locale } from "@/types";

function makeNavStage(
  overrides: Partial<NavigationStage> = {},
): NavigationStage {
  return {
    id: "nav-1",
    type: StageType.Navigation,
    text: { [Locale.en]: "" },
    route: [],
    targetPoint: null,
    ...overrides,
  };
}

describe("fromLegacyNavStage — strips endpoints from legacy `route`", () => {
  it("returns empty waypoints when the route is just [start, target]", () => {
    const result = fromLegacyNavStage(
      makeNavStage({
        route: [P.origin, P.firstTarget],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([]);
    expect(result.targetPoint).toEqual(P.firstTarget);
  });

  it("returns the interior points when the route has them", () => {
    const result = fromLegacyNavStage(
      makeNavStage({
        route: [P.origin, P.waypointA, P.waypointB, P.firstTarget],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([P.waypointA, P.waypointB]);
  });

  it("returns empty waypoints when the route is empty", () => {
    const result = fromLegacyNavStage(
      makeNavStage({ route: [], targetPoint: P.firstTarget }),
      P.origin,
    );
    expect(result.waypoints).toEqual([]);
  });

  it("returns empty waypoints when the route is null", () => {
    const result = fromLegacyNavStage(
      makeNavStage({ route: null, targetPoint: P.firstTarget }),
      P.origin,
    );
    expect(result.waypoints).toEqual([]);
  });

  it("strips a single point that equals the derived start", () => {
    // Edge case: legacy data where the stop has a start but no target;
    // route[0] is the start anchor and that's all.
    const result = fromLegacyNavStage(
      makeNavStage({ route: [P.origin], targetPoint: null }),
      P.origin,
    );
    expect(result.waypoints).toEqual([]);
  });

  it("preserves data that doesn't look legacy-shaped (no endpoint match)", () => {
    // The route's bookends don't equal the derived start or stored
    // targetPoint, so we trust the stored points as interior waypoints.
    const result = fromLegacyNavStage(
      makeNavStage({
        route: [P.waypointA, P.waypointB, P.waypointC],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([P.waypointA, P.waypointB, P.waypointC]);
  });

  it("preserves targetPoint, id, type, and text", () => {
    const result = fromLegacyNavStage(
      makeNavStage({
        id: "stage-abc",
        text: { [Locale.en]: "Walk to the bridge" },
        route: [P.origin, P.firstTarget],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.id).toBe("stage-abc");
    expect(result.type).toBe(StageType.Navigation);
    expect(result.text).toEqual({ [Locale.en]: "Walk to the bridge" });
    expect(result.targetPoint).toEqual(P.firstTarget);
  });

  it("dedupes consecutive duplicate points carried over from legacy data", () => {
    const result = fromLegacyNavStage(
      makeNavStage({
        route: [P.origin, P.waypointA, P.waypointA, P.firstTarget],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([P.waypointA]);
  });
});

describe("fromLegacyNavStage — already-new-shape inputs pass through", () => {
  it("preserves an input that already has waypoints set", () => {
    // Once tours start saving in the new shape, the wire payload
    // will be a mix of legacy and new. New-shape stages must be
    // returned unchanged.
    const result = fromLegacyNavStage(
      makeNavStage({
        route: null,
        waypoints: [P.waypointA, P.waypointB],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([P.waypointA, P.waypointB]);
    expect(result.targetPoint).toEqual(P.firstTarget);
  });

  it("prefers existing waypoints over decoding `route` when both are present", () => {
    // Mixed input: stale `route` still hanging around alongside the
    // canonical `waypoints`. Trust `waypoints` and ignore `route`.
    const result = fromLegacyNavStage(
      makeNavStage({
        route: [P.origin, P.outlier, P.firstTarget],
        waypoints: [P.waypointA],
        targetPoint: P.firstTarget,
      }),
      P.origin,
    );
    expect(result.waypoints).toEqual([P.waypointA]);
  });
});
