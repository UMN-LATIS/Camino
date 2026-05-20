/**
 * Round-trip persistence checks for NavigationStage `waypoints` and `targetPoint`
 * via the stop-level save (`updateTourStop`). The tour-level endpoint
 * (`PUT /creator/edit/{id}`) deliberately ignores stop content — see
 * TourEditController::update which only updates `sort_order` on stops — so all
 * stop edits flow through `updateTourStop`.
 */

import type {
  LngLat,
  NavigationStage,
  Stage,
  Tour,
  TourStop,
} from "../../../resources/types";

interface CreatorStoreTestApi {
  updateTourStop(tourId: number, stop: TourStop): Promise<TourStop>;
  getTour(tourId: number): { value: Tour };
  fetchTours(): Promise<Tour[]>;
}

const seededTourTitle = "Stone Arch Bridge";

function isNavigationStage(stage: Stage): stage is NavigationStage {
  return stage.type === "navigation";
}

function navStageOfStop(stop: TourStop): NavigationStage {
  const stage = stop.stop_content.stages.find(isNavigationStage);
  if (!stage) throw new Error(`stop ${stop.id} has no navigation stage`);
  return stage;
}

function firstNavBearingStop(tour: Tour): TourStop {
  const stop = tour.stops.find((s) =>
    s.stop_content.stages.some(isNavigationStage),
  );
  if (!stop) throw new Error("expected at least one nav-bearing stop");
  return stop;
}

function visitDebugPageForSeededTour() {
  cy.visit("/creator");
  cy.contains(".tour-list-item", seededTourTitle)
    .find("a[href*='/creator/tours/']")
    .first()
    .invoke("attr", "href")
    .then((href) => {
      const tourId = Number(href?.split("/").pop());
      expect(tourId, "seeded tour id").to.be.a("number").and.not.be.NaN;
      cy.wrap(tourId).as("tourId");
      cy.visit(`/creator/tours/${tourId}/routes-debug`);
    });

  cy.get("[data-cy=tour-routes-debug-stop-list]", { timeout: 30000 }).should(
    "exist",
  );
}

function withStore(
  callback: (store: CreatorStoreTestApi, tourId: number) => void,
) {
  cy.get<number>("@tourId").then((tourId) => {
    // Vue's onMounted on the debug page exposes `__creatorStore` async, so retry
    // on the property until it lands rather than reading once eagerly.
    cy.window()
      .its("__creatorStore", { timeout: 15000 })
      .should("exist")
      .then((store) => {
        callback(store as unknown as CreatorStoreTestApi, tourId);
      });
  });
}

function replaceFirstNavStage(
  stop: TourStop,
  patch: Partial<NavigationStage>,
): TourStop {
  const original = navStageOfStop(stop);
  return {
    ...stop,
    stop_content: {
      ...stop.stop_content,
      stages: stop.stop_content.stages.map((s) =>
        s.id === original.id ? { ...original, ...patch } : s,
      ),
    },
  };
}

describe("NavigationStage save round-trip via updateTourStop", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    visitDebugPageForSeededTour();
  });

  it("persists new waypoints and targetPoint across a server reload", () => {
    const newWaypoints: LngLat[] = [
      { lng: -93.26, lat: 44.99 },
      { lng: -93.258, lat: 44.992 },
      { lng: -93.255, lat: 44.994 },
    ];
    const newTarget: LngLat = { lng: -93.253, lat: 44.997 };

    withStore((store, tourId) => {
      const stop = firstNavBearingStop(store.getTour(tourId).value);
      const updatedStop = replaceFirstNavStage(stop, {
        waypoints: newWaypoints,
        targetPoint: newTarget,
      });

      cy.wrap(store.updateTourStop(tourId, updatedStop)).then(() => {
        cy.reload();
        cy.get("[data-cy=tour-routes-debug-stop-list]", {
          timeout: 30000,
        }).should("exist");

        withStore((s2, t2) => {
          const reloaded = navStageOfStop(
            s2.getTour(t2).value.stops.find((x) => x.id === stop.id)!,
          );
          expect(reloaded.targetPoint, "targetPoint persisted").to.deep.equal(
            newTarget,
          );
          expect(reloaded.waypoints, "waypoints persisted").to.deep.equal(
            newWaypoints,
          );
        });
      });
    });
  });

  it("clearing waypoints to [] persists across reload", () => {
    withStore((store, tourId) => {
      const stop = firstNavBearingStop(store.getTour(tourId).value);
      const seeded: LngLat[] = [
        { lng: -93.241, lat: 44.973 },
        { lng: -93.243, lat: 44.974 },
      ];

      const withSeed = replaceFirstNavStage(stop, { waypoints: seeded });
      cy.wrap(store.updateTourStop(tourId, withSeed)).then((after) => {
        const afterStop = after as TourStop;
        expect(
          navStageOfStop(afterStop).waypoints,
          "seed persisted",
        ).to.deep.equal(seeded);

        const cleared = replaceFirstNavStage(afterStop, { waypoints: [] });
        cy.wrap(store.updateTourStop(tourId, cleared)).then(() => {
          cy.reload();
          cy.get("[data-cy=tour-routes-debug-stop-list]", {
            timeout: 30000,
          }).should("exist");

          withStore((s2, t2) => {
            const reloaded = navStageOfStop(
              s2.getTour(t2).value.stops.find((x) => x.id === stop.id)!,
            );
            expect(
              reloaded.waypoints,
              "cleared waypoints persisted",
            ).to.deep.equal([]);
          });
        });
      });
    });
  });

  it("changing only targetPoint preserves existing waypoints", () => {
    const seededWaypoints: LngLat[] = [
      { lng: -93.27, lat: 45.0 },
      { lng: -93.268, lat: 45.001 },
    ];
    const initialTarget: LngLat = { lng: -93.265, lat: 45.003 };
    const movedTarget: LngLat = { lng: -93.26, lat: 45.005 };

    withStore((store, tourId) => {
      const stop = firstNavBearingStop(store.getTour(tourId).value);
      const initial = replaceFirstNavStage(stop, {
        waypoints: seededWaypoints,
        targetPoint: initialTarget,
      });

      cy.wrap(store.updateTourStop(tourId, initial)).then((afterSeed) => {
        // Now change only the targetPoint.
        const moved = replaceFirstNavStage(afterSeed as TourStop, {
          targetPoint: movedTarget,
        });
        cy.wrap(store.updateTourStop(tourId, moved)).then(() => {
          cy.reload();
          cy.get("[data-cy=tour-routes-debug-stop-list]", {
            timeout: 30000,
          }).should("exist");

          withStore((s2, t2) => {
            const reloaded = navStageOfStop(
              s2.getTour(t2).value.stops.find((x) => x.id === stop.id)!,
            );
            expect(
              reloaded.targetPoint,
              "moved target persisted",
            ).to.deep.equal(movedTarget);
            expect(
              reloaded.waypoints,
              "waypoints preserved across targetPoint-only edit",
            ).to.deep.equal(seededWaypoints);
          });
        });
      });
    });
  });
});
