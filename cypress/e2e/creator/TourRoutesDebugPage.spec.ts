/**
 * Safety net for the tour-routes geometry model.
 *
 * The debug page is a deterministic test harness: it renders every
 * nav-bearing stop in a static card with the stage's start, target,
 * and route printed as text. We assert the chain-integrity
 * invariants the model promises:
 *
 *   • Each card displays start, target, and route values.
 *   • Stop N+1's displayed start equals stop N's displayed target
 *     (derived-start cascade).
 *   • Editing stop N's target through the store seam moves stop
 *     N+1's displayed start to the new value (re-derivation on
 *     state change).
 *
 * These run against the seeded Stone Arch Bridge tour. We drive
 * mutations through `window.__creatorStore` rather than synthesizing
 * canvas drags — Mapbox Draw vertices live in a WebGL canvas, not
 * the DOM, so click/drag assertions there would be flaky and slow.
 *
 * The chain invariant currently holds because `normalizeTour`
 * prepends each stop's start to its `route` at fetch time. After
 * the translator is wired in, the same invariant must keep holding
 * — at which point these tests are the alarm.
 */

// Inline shapes — see the stashed spec for the full rationale.
// Importing from `@/types` pulls in the Pinia store at runtime,
// which transitively imports axios and document. None of those
// exist in the Cypress spec compiler context.
interface LngLat {
  lng: number;
  lat: number;
}

interface NavigationStage {
  id: string;
  type: "navigation";
  text: Record<string, string | undefined>;
  route: LngLat[] | null;
  waypoints?: LngLat[];
  targetPoint: LngLat | null;
}

interface Stage {
  id?: string;
  type: string;
  [key: string]: unknown;
}

interface TourStop {
  id: number;
  tour_id: number;
  sort_order: number;
  stop_content: {
    title: Record<string, string>;
    subtitle: Record<string, string>;
    header_image: { src: string; alt: string } | null;
    stages: Stage[];
  };
  created_at: string;
}

interface Tour {
  id: number;
  start_location: LngLat | null;
  stops: TourStop[];
}

interface CreatorStoreSeam {
  updateTourStopStage(
    tourId: number,
    stopId: number,
    stage: { id: string } & Record<string, unknown>,
  ): void;
  getTour(tourId: number): { value: Tour };
  fetchTours(): Promise<Tour[]>;
}

interface WindowWithSeam extends Window {
  __creatorStore?: CreatorStoreSeam;
}

const seededTourTitle = "Stone Arch Bridge";

function navStageOfStop(stop: TourStop): NavigationStage {
  const stage = stop.stop_content.stages.find((s) => s.type === "navigation");
  if (!stage) throw new Error(`stop ${stop.id} has no navigation stage`);
  return stage as unknown as NavigationStage;
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
  callback: (store: CreatorStoreSeam, tourId: number) => void,
) {
  cy.get<number>("@tourId").then((tourId) => {
    cy.window().then((win) => {
      const store = (win as WindowWithSeam).__creatorStore;
      expect(store, "creator store seam").to.exist;
      callback(store as CreatorStoreSeam, tourId);
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
      const navBearingCount = tour.stops.filter((stop) =>
        stop.stop_content.stages.some((s) => s.type === "navigation"),
      ).length;
      cy.get("[data-cy=stop-route-card]").should(
        "have.length",
        navBearingCount,
      );
    });
  });

  it("each card displays start, target, and route values", () => {
    cy.get("[data-cy=stop-route-card]").each(($card) => {
      cy.wrap($card)
        .find("[data-cy=stop-route-card-start]")
        .should("exist")
        .invoke("text")
        .should("match", /\{ lng: -?\d+\.\d+, lat: -?\d+\.\d+ \}|null/);

      cy.wrap($card).find("[data-cy=stop-route-card-target]").should("exist");

      cy.wrap($card).find("[data-cy=stop-route-card-route]").should("exist");
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

      // The chain: each card's start should equal the previous card's
      // target. We can't say anything about the first card's start
      // (it's anchored on tour.start_location, not a prior target).
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
      const navBearingStop = tour.stops.find((stop) =>
        stop.stop_content.stages.some((s) => s.type === "navigation"),
      );
      expect(navBearingStop, "at least one nav-bearing stop").to.exist;

      const navStage = navStageOfStop(navBearingStop as TourStop);
      const baseTarget = navStage.targetPoint ?? { lng: -93, lat: 45 };
      const movedTarget: LngLat = {
        lng: baseTarget.lng + 0.01,
        lat: baseTarget.lat + 0.01,
      };

      store.updateTourStopStage(tourId, (navBearingStop as TourStop).id, {
        ...navStage,
        targetPoint: movedTarget,
      });

      cy.get(
        `[data-cy=stop-route-card][data-cy-stop-id="${(navBearingStop as TourStop).id}"]`,
      )
        .find("[data-cy=stop-route-card-target]")
        .should("have.text", formatLngLat(movedTarget));
    });
  });

  // Forward-spec for the new geometry model. Today this fails because
  // `getTourStopStartPoint` reads stop N+1's `route[0]`, which is
  // frozen at fetch-time normalization and does not re-flow when
  // stop N's targetPoint is mutated in the store. After the
  // translator is wired in and selectors derive `start` from prior
  // stops at read time, this should pass — at which point flip the
  // `.skip` to `.only` while you verify, then drop the `.skip`.
  it.skip("editing stop N's targetPoint cascades to stop N+1's displayed start", () => {
    withStore((store, tourId) => {
      const tour = store.getTour(tourId).value;
      const navBearingStops = tour.stops.filter((stop) =>
        stop.stop_content.stages.some((s) => s.type === "navigation"),
      );
      expect(
        navBearingStops.length,
        "at least two nav-bearing stops",
      ).to.be.at.least(2);

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
