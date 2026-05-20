/** Read-side derivations: stop endpoints, cascade, and polyline assembly. */

import { describe, it, expect } from "vitest";
import {
  getTourStartPoint,
  getStopStartPoint,
  getStopEndPoint,
  getStopRouteByIndex,
  getNavStageStartPoint,
} from "./tourGeometry";
import { buildTour, buildStop, buildNavStage, P } from "./__fixtures__/tour";
import { type NavigationStage } from "@/types";

describe("getTourStartPoint", () => {
  it("returns the tour's start_location", () => {
    const tour = buildTour({ startLocation: P.origin });
    expect(getTourStartPoint(tour)).toEqual(P.origin);
  });

  it("returns null when no start_location is set", () => {
    const tour = buildTour({ startLocation: null });
    expect(getTourStartPoint(tour)).toBeNull();
  });
});

describe("getStopStartPoint", () => {
  it("returns the tour start_location for stop 0", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(getStopStartPoint(tour, 0)).toEqual(P.origin);
  });

  it("returns the previous stop's targetPoint for a later stop", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: P.secondTarget }),
      ],
    });
    expect(getStopStartPoint(tour, 1)).toEqual(P.firstTarget);
  });

  it("cascades back through stops with null targetPoints", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({ id: 2, targetPoint: null }),
        buildStop({ id: 3, targetPoint: null }),
        buildStop({ id: 4, targetPoint: P.thirdTarget }),
      ],
    });
    expect(getStopStartPoint(tour, 3)).toEqual(P.firstTarget);
  });

  it("falls through to tour.start_location when every prior target is null", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({ id: 1, targetPoint: null }),
        buildStop({ id: 2, targetPoint: null }),
        buildStop({ id: 3 }),
      ],
    });
    expect(getStopStartPoint(tour, 2)).toEqual(P.origin);
  });

  it("returns null when every prior target and start_location are null", () => {
    const tour = buildTour({
      startLocation: null,
      stops: [buildStop({ id: 1, targetPoint: null }), buildStop({ id: 2 })],
    });
    expect(getStopStartPoint(tour, 1)).toBeNull();
  });

  it("uses the LAST nav stage's targetPoint when a stop has multiple", () => {
    const stopWithTwoNavStages = buildStop({
      id: 1,
      stages: [
        buildNavStage({ targetPoint: P.waypointA }),
        buildNavStage({ targetPoint: P.firstTarget }),
      ],
    });
    const tour = buildTour({
      stops: [stopWithTwoNavStages, buildStop({ id: 2 })],
    });
    expect(getStopStartPoint(tour, 1)).toEqual(P.firstTarget);
  });
});

describe("getStopEndPoint", () => {
  it("returns the stop's single nav-stage targetPoint", () => {
    const tour = buildTour({
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(getStopEndPoint(tour, 0)).toEqual(P.firstTarget);
  });

  it("returns the LAST nav stage's targetPoint when a stop has multiple", () => {
    const stop = buildStop({
      id: 1,
      stages: [
        buildNavStage({ targetPoint: P.waypointA }),
        buildNavStage({ targetPoint: P.firstTarget }),
      ],
    });
    expect(getStopEndPoint(buildTour({ stops: [stop] }), 0)).toEqual(
      P.firstTarget,
    );
  });

  it("returns null when the stop's nav stage has no targetPoint", () => {
    const tour = buildTour({
      stops: [buildStop({ id: 1, targetPoint: null })],
    });
    expect(getStopEndPoint(tour, 0)).toBeNull();
  });

  it("returns null when the stop has no nav stage", () => {
    const stop = buildStop({ id: 1, stages: [] });
    expect(getStopEndPoint(buildTour({ stops: [stop] }), 0)).toBeNull();
  });
});

describe("getStopRouteByIndex", () => {
  it("returns [] when tour is null", () => {
    expect(getStopRouteByIndex(null, 0)).toEqual([]);
  });

  it("is [start, target] when there are no waypoints", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([P.origin, P.firstTarget]);
  });

  it("interleaves waypoints between start and target", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({
          id: 1,
          route: [P.waypointA, P.waypointB],
          targetPoint: P.firstTarget,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([
      P.origin,
      P.waypointA,
      P.waypointB,
      P.firstTarget,
    ]);
  });

  it("uses the derived start of a later stop", () => {
    const tour = buildTour({
      stops: [
        buildStop({ id: 1, targetPoint: P.firstTarget }),
        buildStop({
          id: 2,
          route: [P.waypointC],
          targetPoint: P.secondTarget,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 1)).toEqual([
      P.firstTarget,
      P.waypointC,
      P.secondTarget,
    ]);
  });

  it("omits a null endpoint rather than blowing up", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [
        buildStop({
          id: 1,
          route: [P.waypointA],
          targetPoint: null,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([P.origin, P.waypointA]);
  });

  it("omits a null derived start rather than blowing up", () => {
    const tour = buildTour({
      startLocation: null,
      stops: [
        buildStop({
          id: 1,
          route: [P.waypointA],
          targetPoint: P.firstTarget,
        }),
      ],
    });
    expect(getStopRouteByIndex(tour, 0)).toEqual([P.waypointA, P.firstTarget]);
  });

  it("returns [] for an out-of-range index", () => {
    const tour = buildTour({ stops: [buildStop({ id: 1 })] });
    expect(getStopRouteByIndex(tour, 99)).toEqual([]);
  });
});

describe("getNavStageStartPoint", () => {
  it("is the stop's derived start for the first nav stage of a stop", () => {
    const tour = buildTour({
      startLocation: P.origin,
      stops: [buildStop({ id: 1, targetPoint: P.firstTarget })],
    });
    const firstStage = tour.stops[0].stop_content.stages[0] as NavigationStage;
    expect(getNavStageStartPoint(tour, 0, firstStage.id)).toEqual(P.origin);
  });

  it("is the previous nav stage's targetPoint within the same stop", () => {
    const firstStage = buildNavStage({ targetPoint: P.waypointA });
    const secondStage = buildNavStage({ targetPoint: P.firstTarget });
    const stop = buildStop({
      id: 1,
      stages: [firstStage, secondStage],
    });
    const tour = buildTour({ startLocation: P.origin, stops: [stop] });

    expect(getNavStageStartPoint(tour, 0, secondStage.id)).toEqual(P.waypointA);
  });

  it("falls through to the stop's derived start when prior stages have no targetPoint", () => {
    const firstStage = buildNavStage({ targetPoint: null });
    const secondStage = buildNavStage({ targetPoint: P.firstTarget });
    const stop = buildStop({
      id: 1,
      stages: [firstStage, secondStage],
    });
    const tour = buildTour({ startLocation: P.origin, stops: [stop] });

    expect(getNavStageStartPoint(tour, 0, secondStage.id)).toEqual(P.origin);
  });
});
