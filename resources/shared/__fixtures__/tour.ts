/** Test fixtures producing the canonical interior-only tour geometry shape. */

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

/** Named lng/lat points so assertions read like prose. */
export const Points = {
  origin: { lng: -93.0, lat: 44.0 },
  firstTarget: { lng: -93.1, lat: 44.1 },
  secondTarget: { lng: -93.2, lat: 44.2 },
  thirdTarget: { lng: -93.3, lat: 44.3 },
  waypointA: { lng: -93.05, lat: 44.05 },
  waypointB: { lng: -93.07, lat: 44.07 },
  waypointC: { lng: -93.15, lat: 44.15 },
  outlier: { lng: -120.0, lat: 47.0 },
} as const satisfies Record<string, LngLat>;

let navIdCounter = 0;
function nextNavId(): string {
  navIdCounter += 1;
  return `nav-${navIdCounter}`;
}

interface NavStageOptions {
  id?: string;
  waypoints?: LngLat[];
  targetPoint?: Maybe<LngLat>;
}

export function buildNavStage(options: NavStageOptions = {}): NavigationStage {
  return {
    id: options.id ?? nextNavId(),
    type: StageType.Navigation,
    text: { [Locale.en]: "" },
    waypoints: options.waypoints ?? [],
    targetPoint: options.targetPoint ?? null,
  };
}

interface StopOptions {
  id: number;
  waypoints?: LngLat[];
  targetPoint?: Maybe<LngLat>;
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
  // `??` would collapse an explicit null back into the default; use `in` to distinguish.
  const startLocation: Maybe<LngLat> =
    "startLocation" in options
      ? (options.startLocation ?? null)
      : Points.origin;

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
