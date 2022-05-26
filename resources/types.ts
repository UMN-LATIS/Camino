export type Maybe<T> = T | null;

/**
 * For branding types that have the same BaseType
 * but different usage type.
 * Think: Cow Branding (not Shoe/Cereal/Soap Brand, but kinda)
 * @example
 * type USD = Brand<number, 'USD'>
 * type EUR = Brand<number, 'EUR'>
 */
type Brand<BaseType, BrandedType> = BaseType & { __brand: BrandedType };

export enum Locale {
  en = "English",
  es = "Español",
  fr = "Français",
}

export interface LngLat {
  lng: number;
  lat: number;
}

export type LocalizedText = {
  [localeKey in Locale]: string;
};

export interface ARWaypoint {
  text: LocalizedText;
  altitude: Maybe<number>;
  location: LngLat;
}

export interface CustomBaseMap {
  image: Maybe<string>;
  coords: {
    upperleft: LngLat;
    lowerright: LngLat;
  };
  use_basemap: boolean;
}

export interface GeocodedLocation {
  streetNumber: Maybe<string>;
  streetName: Maybe<string>;

  /** @example 'Minneapolis' */
  city: Maybe<string>;

  /**
   * city
   * @example 'Minneapolis'
   **/
  locality: Maybe<string>;

  /** @example 'Minnesota' */
  state: Maybe<string>;

  /** @example 'United States' */
  country: Maybe<string>;

  /** @example '55414' */
  postalCode: Maybe<string>;

  /** @example 'Marcy Holmes' */
  neighborhood: Maybe<string>;
}

export enum StageType {
  AR = "ar",
  EmbedFrame = "embed-frame",
  DeepDives = "deepdives",
  DeepDivesSummary = "deepdives-summary",
  Feedback = "feedback",
  Gallery = "gallery",
  Guide = "guide",
  LanguageSelector = "language",
  Navigation = "navigation",
  Separator = "separator",
  Quiz = "quiz",
}

export type UUID = Brand<string, "UUID">;
export interface Waypoint {
  text: LocalizedText;
  altitude: Maybe<number>;
  location: LngLat;
}

export interface Stage {
  id: UUID;
  type: StageType;
}

export interface DeepDiveItem {
  title: LocalizedText;
  text: LocalizedText;
}

export interface ARStage extends Stage {
  text: LocalizedText;
  waypoints: Waypoint[];
}
export interface DeepDiveStage extends Stage {
  deepdives: DeepDiveItem[];
}
export interface DeepDiveSummaryStage extends Stage {
  request_email: boolean;
  text: LocalizedText;
}

export interface EmbedStage extends Stage {
  source: URL;
}

export interface FeedbackStage extends Stage {
  text: LocalizedText;
}

export interface GalleryStage extends Stage {
  images: Image[];
}

export interface GuideStage extends Stage {
  text: LocalizedText;
}
export interface LanguageSelectorStage extends Stage {}
export interface NavigationStage extends Stage {
  text: LocalizedText;
  route: LngLat[];
  targetPoint: LngLat;
}

export enum QuizType {
  MultipleChoice = "multiple_choice",
}

export interface QuizChoice {
  text: LocalizedText;
  correct: boolean;
}
export interface QuizStage extends Stage {
  quizType: QuizType;
  questionText: LocalizedText;
  hintText: LocalizedText;
  responses: QuizChoice[];
}
export interface SeparatorStage extends Stage {}

export type URL = Brand<string, "URL">;

export interface Image {
  src: URL;
  alt: string;
}

export type DateTime = Brand<string, "DateTime">;

export interface TourStop {
  id: number;
  tour_id: number;
  stop_content: {
    title: LocalizedText;
    stages: Stage[];
    header_image: Image;
  };
  sort_order: number;
  deleted_at: Maybe<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
}

export enum AuthProvider {
  Shibboleth = "shibboleth",
}

export interface User {
  id: number;
  name: string;
  email: string;
  provider: AuthProvider;
  unique_id: string;
  deleted_at?: Maybe<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
  pivot?: {
    tour_id: number;
    user_id: number;
  };
}

export enum TourStyle {
  EntireTour = "entire_tour",
}

export interface Tour {
  id: number;

  /** Tour is published and available to users */
  active: boolean;

  /** Tour is publicly listed */
  public: boolean;

  title: string;

  tour_content: {
    /** Supported language translations of this tour */
    languages: Locale[];

    /** tour begins with default template */
    use_template: boolean;

    /** map to use in place of normal map */
    custom_base_map: CustomBaseMap;
  };
  geocoded: GeocodedLocation;

  /** tour can be walked */
  walking: boolean;

  /** tour can be taken by car */
  driving: boolean;

  /** tour can be biked */
  biking: boolean;

  start_location: Maybe<LngLat>;
  style: TourStyle;
  stops: TourStop[];
  users: User[];
}
