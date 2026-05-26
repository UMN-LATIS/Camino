import { describe, it, expect } from "vitest";
import { ref } from "vue";
import {
  selectTourStopStartPoint,
  selectNextTourStopStartPoint,
} from "./creatorStoreSelectors";
import { buildTour, buildStop, Points } from "@/shared/__fixtures__/tour";
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
      startLocation: Points.origin,
      stops: [buildStop({ id: 1, targetPoint: Points.firstTarget })],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 1)).toEqual(
      Points.origin,
    );
  });

  it("returns the prior stop's targetPoint for a later stop", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: Points.firstTarget }),
        buildStop({ id: 2, targetPoint: Points.secondTarget }),
      ],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 2)).toEqual(
      Points.firstTarget,
    );
  });

  it("reflects a mutation to the prior stop's targetPoint immediately", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: Points.firstTarget }),
        buildStop({ id: 2, targetPoint: Points.secondTarget }),
      ],
    });
    const state = stateOf(tour);

    const stage = state.tours.value[0].stops[0].stop_content.stages[0] as {
      targetPoint: typeof Points.outlier;
    };
    stage.targetPoint = Points.outlier;

    expect(selectTourStopStartPoint(state, tour.id, 2)).toEqual(Points.outlier);
  });

  it("cascades through stops with null targetPoints", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: Points.firstTarget }),
        buildStop({ id: 2, targetPoint: null }),
        buildStop({ id: 3 }),
      ],
    });
    expect(selectTourStopStartPoint(stateOf(tour), tour.id, 3)).toEqual(
      Points.firstTarget,
    );
  });
});

describe("selectTourStopStartPoint — survives a reorder", () => {
  it("reflects the new prior stop after the array is moved", () => {
    const tour = buildTour({
      startLocation: Points.origin,
      stops: [
        buildStop({ id: 1, targetPoint: Points.firstTarget }),
        buildStop({ id: 2, targetPoint: Points.secondTarget }),
        buildStop({ id: 3, targetPoint: Points.thirdTarget }),
      ],
    });
    const state = stateOf(tour);

    // Mimic moveTourStopByIndex: [A, B, C] → [C, A, B].
    const stops = state.tours.value[0].stops;
    state.tours.value[0].stops = [stops[2], stops[0], stops[1]];

    expect(selectTourStopStartPoint(state, tour.id, 3)).toEqual(Points.origin);
    expect(selectTourStopStartPoint(state, tour.id, 1)).toEqual(
      Points.thirdTarget,
    );
    expect(selectTourStopStartPoint(state, tour.id, 2)).toEqual(
      Points.firstTarget,
    );
  });
});

describe("selectNextTourStopStartPoint", () => {
  it("returns the next stop's derived start", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: Points.firstTarget }),
        buildStop({ id: 2, targetPoint: Points.secondTarget }),
        buildStop({ id: 3, targetPoint: Points.thirdTarget }),
      ],
    });
    expect(selectNextTourStopStartPoint(stateOf(tour), tour.id, 1)).toEqual(
      Points.firstTarget,
    );
  });

  it("returns null when there is no next stop", () => {
    const tour = buildTour({
      stops: [buildStop({ id: 1, targetPoint: Points.firstTarget })],
    });
    expect(selectNextTourStopStartPoint(stateOf(tour), tour.id, 1)).toBeNull();
  });
});
