/**
 * Tests for selectors that need to behave differently under the new
 * geometry model. `selectTourStopStartPoint` is the headline switch:
 * historically it read the stage's own `route[0]` — which is correct
 * after fetch-time normalization but goes stale after any mutation
 * that doesn't re-flow the chain. The new behavior derives the
 * start from prior stops at read time, so mutations to a prior
 * stop's targetPoint are visible immediately.
 */
import { describe, it, expect } from "vitest";
import { ref } from "vue";
import {
  selectTourStopStartPoint,
  selectNextTourStopStartPoint,
} from "./creatorStoreSelectors";
import { buildTour, buildStop, P } from "@/shared/__fixtures__/tour";
import type { CreatorStoreState } from "./useCreatorStore";
import { type Tour } from "@/types";

function stateOf(tour: Tour): CreatorStoreState {
  return {
    tours: ref([tour]),
    error: ref(null),
    isReady: ref(true),
  };
}

describe("selectTourStopStartPoint — derives from prior stops at read time", () => {
  it("returns tour.start_location for the first nav-bearing stop", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 1)).toEqual(
      P.origin,
    );
  });

  it("returns the prior stop's targetPoint for a later stop", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: P.secondTarget }),
      ],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 2)).toEqual(
      P.firstTarget,
    );
  });

  it("reflects a mutation to the prior stop's targetPoint immediately", () => {
    // The whole point of the new model: stop 2's start derives from
    // stop 1's target at read time. Mutating stop 1 must show up on
    // the next read of stop 2's start.
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: P.secondTarget }),
      ],
    });
    const state = stateOf(tour);

    // Mutate stop 1's targetPoint in-place.
    const stage = state.tours.value[0].stops[0].stop_content.stages[0] as {
      targetPoint: typeof P.outlier;
    };
    stage.targetPoint = P.outlier;

    expect(selectTourStopStartPoint(state, tour.id, 2)).toEqual(P.outlier);
  });

  it("cascades through stops with null targetPoints", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: null }),
        buildStop({ id: 3 }),
      ],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 3)).toEqual(
      P.firstTarget,
    );
  });
});

describe("selectTourStopStartPoint — survives a reorder", () => {
  it("reflects the new prior stop after the array is moved", () => {
    // Build [A→firstTarget, B→secondTarget, C→thirdTarget].
    // C's derived start is B's targetPoint (secondTarget).
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: P.secondTarget }),
        buildStop({ id: 3, targetPoint: P.thirdTarget }),
      ],
    });
    const state = stateOf(tour);

    // Mimic moveTourStopByIndex: [A, B, C] → [C, A, B].
    // C is now first; its derived start should be tour.start_location.
    const stops = state.tours.value[0].stops;
    state.tours.value[0].stops = [stops[2], stops[0], stops[1]];

    expect(selectTourStopStartPoint(state, tour.id, 3)).toEqual(P.origin);
    expect(selectTourStopStartPoint(state, tour.id, 1)).toEqual(P.thirdTarget);
    expect(selectTourStopStartPoint(state, tour.id, 2)).toEqual(P.firstTarget);
  });
});

describe("selectNextTourStopStartPoint", () => {
  it("returns the next stop's derived start", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: P.secondTarget }),
        buildStop({ id: 3, targetPoint: P.thirdTarget }),
      ],
    });
    // From stop 1's perspective, the next stop is stop 2 — whose
    // derived start is stop 1's target.
    expect(selectNextTourStopStartPoint(stateOf(tour), tour.id, 1)).toEqual(
      P.firstTarget,
    );
  });

  it("returns null when there is no next stop", () => {
    const tour = buildTour({
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(selectNextTourStopStartPoint(stateOf(tour), tour.id, 1)).toBeNull();
  });
});
