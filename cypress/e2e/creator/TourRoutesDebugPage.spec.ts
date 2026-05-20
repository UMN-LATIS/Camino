/** End-to-end chain-integrity check for the derived-start tour geometry model. */

// Type-only import: erased at compile time, so the runtime side-effects of
// @/types (Pinia store, axios) never reach the Cypress browser context.
import type {
  LngLat,
  NavigationStage,
  Stage,
  Tour,
  TourStop,
} from "../../../resources/types";

interface CreatorStoreTestApi {
  updateTourStopStage(
    tourId: number,
    stopId: number,
    stage: { id: string } & Record<string, unknown>,
  ): void;
  getTour(tourId: number): { value: Tour };
  fetchTours(): Promise<Tour[]>;
}

interface WindowWithCreatorStore extends Window {
  __creatorStore?: CreatorStoreTestApi;
}

const seededTourTitle = "Stone Arch Bridge";

// The app's Stage union doesn't discriminate on `type` (it's the StageType enum,
// not a literal), so equality checks don't narrow on their own. A user-defined
// guard gives us the narrowing without a cast.
function isNavigationStage(stage: Stage): stage is NavigationStage {
  return stage.type === "navigation";
}

function navStageOfStop(stop: TourStop): NavigationStage {
  const stage = stop.stop_content.stages.find(isNavigationStage);
  if (!stage) throw new Error(`stop ${stop.id} has no navigation stage`);
  return stage;
}

function isNavBearing(stop: TourStop): boolean {
  return stop.stop_content.stages.some(isNavigationStage);
}

function formatLngLat(point: LngLat | null): string {
  if (!point) return "null";
  return `{ lng: ${point.lng.toFixed(6)}, lat: ${point.lat.toFixed(6)} }`;
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
  cy.get("[data-cy=stop-route-card]").should("have.length.greaterThan", 1);
}

function withStore(
  callback: (store: CreatorStoreTestApi, tourId: number) => void,
) {
  cy.get<number>("@tourId").then((tourId) => {
    cy.window().then((win) => {
      const store = (win as WindowWithCreatorStore).__creatorStore;
      if (!store) throw new Error("creator store not exposed on window");
      callback(store, tourId);
    });
  });
}

describe("Tour routes debug page", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    visitDebugPageForSeededTour();
  });

  it("renders one card per nav-bearing stop", () => {
    withStore((store, tourId) => {
      const tour = store.getTour(tourId).value;
      const navBearingCount = tour.stops.filter(isNavBearing).length;
      cy.get("[data-cy=stop-route-card]").should(
        "have.length",
        navBearingCount,
      );
    });
  });

  it("each card displays start, target, and waypoints values", () => {
    cy.get("[data-cy=stop-route-card]").each(($card) => {
      cy.wrap($card)
        .find("[data-cy=stop-route-card-start]")
        .should("exist")
        .invoke("text")
        .should("match", /\{ lng: -?\d+\.\d+, lat: -?\d+\.\d+ \}|null/);

      cy.wrap($card).find("[data-cy=stop-route-card-target]").should("exist");

      cy.wrap($card)
        .find("[data-cy=stop-route-card-waypoints]")
        .should("exist");
    });
  });

  it("stop N+1's displayed start equals stop N's displayed target (chain integrity)", () => {
    cy.get("[data-cy=stop-route-card]").then(($cards) => {
      const targetValues: string[] = [];
      const startValues: string[] = [];

      $cards.each((_, card) => {
        const target = card
          .querySelector("[data-cy=stop-route-card-target]")
          ?.textContent?.trim();
        const start = card
          .querySelector("[data-cy=stop-route-card-start]")
          ?.textContent?.trim();
        if (target) targetValues.push(target);
        if (start) startValues.push(start);
      });

      // Skip i=0: the first card's start anchors on tour.start_location, not a prior target.
      for (let i = 1; i < $cards.length; i++) {
        expect(
          startValues[i],
          `stop ${i + 1} start should equal stop ${i} target`,
        ).to.equal(targetValues[i - 1]);
      }
    });
  });

  it("editing stop N's targetPoint updates stop N's displayed target", () => {
    withStore((store, tourId) => {
      const tour = store.getTour(tourId).value;
      const navBearingStop = tour.stops.find(isNavBearing);
      if (!navBearingStop)
        throw new Error("expected at least one nav-bearing stop");

      const navStage = navStageOfStop(navBearingStop);
      const baseTarget = navStage.targetPoint ?? { lng: -93, lat: 45 };
      const movedTarget: LngLat = {
        lng: baseTarget.lng + 0.01,
        lat: baseTarget.lat + 0.01,
      };

      store.updateTourStopStage(tourId, navBearingStop.id, {
        ...navStage,
        targetPoint: movedTarget,
      });

      cy.get(
        `[data-cy=stop-route-card][data-cy-stop-id="${navBearingStop.id}"]`,
      )
        .find("[data-cy=stop-route-card-target]")
        .should("have.text", formatLngLat(movedTarget));
    });
  });

  it("editing stop N's targetPoint cascades to stop N+1's displayed start", () => {
    withStore((store, tourId) => {
      const tour = store.getTour(tourId).value;
      const navBearingStops = tour.stops.filter(isNavBearing);
      if (navBearingStops.length < 2) {
        throw new Error("expected at least two nav-bearing stops");
      }

      const stopN = navBearingStops[0];
      const navStage = navStageOfStop(stopN);
      const baseTarget = navStage.targetPoint ?? { lng: -93, lat: 45 };
      const movedTarget: LngLat = {
        lng: baseTarget.lng + 0.01,
        lat: baseTarget.lat + 0.01,
      };

      store.updateTourStopStage(tourId, stopN.id, {
        ...navStage,
        targetPoint: movedTarget,
      });

      const stopNplus1 = navBearingStops[1];
      cy.get(`[data-cy=stop-route-card][data-cy-stop-id="${stopNplus1.id}"]`)
        .find("[data-cy=stop-route-card-start]")
        .should("have.text", formatLngLat(movedTarget));
    });
  });
});
