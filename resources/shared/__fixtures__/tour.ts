/**
 * Test fixtures for the new tour geometry model.
 *
 * The new model treats a nav stage's interior waypoints and its
 * `targetPoint` as the only stored geometry. A stop's start point is
 * always derived from prior stops (or `tour.start_location` for stop
 * zero) — never stored on the stage. Fixtures here produce that
 * in-memory shape directly so tests stay focused on the chain
 * behavior instead of the legacy wire format.
 *
 * `buildTour({ stops: [...] })` is the entry point. Stops carry one
 * nav stage by default with the `waypoints` and `targetPoint` you
 * provide; pass `stages` to override that for multi-stage cases.
 */

import {
  type Tour,
  type TourStop,
  type NavigationStage,
  type Stage,
  type LngLat,
  type Maybe,
  StageType,
  Locale,
  TourStyle,
} from "@/types";

/**
 * A small library of named lng/lat points used throughout the tests.
 * Naming is deliberately suggestive so assertions read like prose
 * ("expect derivedStart of stop 2 to equal P.firstTarget").
 */
export const P = {
  origin: { lng: -93.0, lat: 44.0 },
  firstTarget: { lng: -93.1, lat: 44.1 },
  secondTarget: { lng: -93.2, lat: 44.2 },
  thirdTarget: { lng: -93.3, lat: 44.3 },
  waypointA: { lng: -93.05, lat: 44.05 },
  waypointB: { lng: -93.07, lat: 44.07 },
  waypointC: { lng: -93.15, lat: 44.15 },
  outlier: { lng: -120.0, lat: 47.0 },
} as const satisfies Record<string, LngLat>;

interface NavStageOptions {
  id?: string;
  waypoints?: LngLat[];
  targetPoint?: Maybe<LngLat>;
}

let navIdCounter = 0;
/**
 * Builds a navigation stage in the canonical post-translation shape:
 * `waypoints` is interior-only, `route` is left unset. Wire-shape
 * stages (with `route`) are built ad-hoc in the translator tests
 * since that's the only place they're constructed by hand.
 */
export function buildNavStage(options: NavStageOptions = {}): NavigationStage {
  navIdCounter += 1;
  return {
    id: options.id ?? `nav-${navIdCounter}`,
    type: StageType.Navigation,
    text: { [Locale.en]: "" },
    route: null,
    waypoints: options.waypoints ?? [],
    targetPoint: options.targetPoint ?? null,
  };
}

interface StopOptions {
  id: number;
  /** Convenience: a single-nav-stage stop with these waypoints. */
  waypoints?: LngLat[];
  /** Convenience: that single nav stage's targetPoint. */
  targetPoint?: Maybe<LngLat>;
  /** Escape hatch for multi-stage stops. */
  stages?: Stage[];
}

export function buildStop(options: StopOptions): TourStop {
  const stages: Stage[] = options.stages ?? [
    buildNavStage({
      waypoints: options.waypoints ?? [],
      targetPoint: options.targetPoint ?? null,
    }),
  ];

  return {
    id: options.id,
    tour_id: 1,
    sort_order: options.id,
    created_at: "2026-01-01T00:00:00Z",
    stop_content: {
      title: { [Locale.en]: `Stop ${options.id}` },
      subtitle: { [Locale.en]: "" },
      header_image: null,
      stages,
    },
  };
}

interface TourOptions {
  id?: number;
  startLocation?: Maybe<LngLat>;
  stops?: TourStop[];
}

export function buildTour(options: TourOptions = {}): Tour {
  // Distinguish "not provided" (default to P.origin) from "explicitly
  // null" (test wants a tour with no start_location). The `??` operator
  // would collapse the latter back into the default.
  const startLocation: Maybe<LngLat> =
    "startLocation" in options ? (options.startLocation ?? null) : P.origin;

  return {
    id: options.id ?? 1,
    active: true,
    public: false,
    title: "Test Tour",
    tour_content: {
      languages: [Locale.en],
      use_template: false,
      custom_base_map: {
        use_basemap: false,
        image: null,
        coords: { upperleft: null, lowerright: null },
      },
    },
    geocoded: {
      city: null,
      locality: null,
      state: null,
      country: null,
      postalCode: null,
      neighborhood: null,
    },
    walking: true,
    driving: false,
    biking: false,
    start_location: startLocation,
    style: TourStyle.EntireTour,
    stops: options.stops ?? [],
    users: [],
  };
}
