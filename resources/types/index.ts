import { useCreatorStore } from "@creator/stores/useCreatorStore";
export type { MyCustomDrawMode } from "./MyCustomDrawMode";

export type Maybe<T> = T | null;

/**
 * For branding types that have the same BaseType
 * but different usage type.
 * Think: Cow Branding (not Shoe/Cereal/Soap Brand, but kinda)
 * @example
 * type USD = Brand<number, 'USD'>
 * type EUR = Brand<number, 'EUR'>
 */
export type Brand<BaseType, BrandedType> = BaseType & { __brand: BrandedType };

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type PartialExcept<T, K extends keyof T> = RecursivePartial<T> &
  Pick<T, K>;

export enum Locale {
  en = "English",
  es = "Español",
  fr = "Français",

  // For the future
  // en = "en",
  // es = "es",
  // fr = "fr",
}

export interface LngLat {
  lng: number;
  lat: number;
}

export type LocalizedText = {
  [localeKey in Locale]?: string;
};

export interface ARWaypoint {
  text: LocalizedText;
  altitude: Maybe<number>;
  location: LngLat;
}

export interface CustomBaseMap {
  image: Maybe<string>;
  coords: {
    upperleft: Maybe<LngLat>;
    lowerright: Maybe<LngLat>;
  };
  use_basemap: boolean;
}

export interface GeocodedLocation {
  streetNumber?: Maybe<string>;
  streetName?: Maybe<string>;

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
export interface Waypoint {
  text: LocalizedText;
  altitude: Maybe<number>;
  location: LngLat;
}

export interface Stage extends Record<string, any> {
  id: string; // uuid
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
  source: string;
}

export interface FeedbackStage extends Stage {
  text: LocalizedText;
}

export interface GalleryImage {
  src: string;
  text: LocalizedText;
}
export interface GalleryStage extends Stage {
  images: GalleryImage[];
}

export interface GuideStage extends Stage {
  text: LocalizedText;
}
export type LanguageSelectorStage = Stage;

export type TourStopRoute = LngLat[];
export interface NavigationStage extends Stage {
  text: LocalizedText;
  route: Maybe<TourStopRoute>;
  targetPoint: Maybe<LngLat>;
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
export type SeparatorStage = Stage;

export interface Image {
  src: string;
  alt: string;
}

export type DateTime = string;

export interface TourStop {
  id: number;
  tour_id: number;
  stop_content: {
    title: LocalizedText;
    subtitle: LocalizedText;
    stages: Stage[];
    header_image: Maybe<Image>;
  };
  sort_order: number;
  deleted_at?: Maybe<DateTime>;
  created_at: DateTime;
  updated_at?: DateTime;
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

export interface FeedbackResponse {
  id: number;
  name: string;
  email: string;
  created_at: DateTime;
  feedback: string;
}

export type CreatorStore = ReturnType<typeof useCreatorStore>;

/**
 * [[minLng, minLat],
 *  [maxLng, maxLat]]
 **/
export type BoundingBox = [[number, number], [number, number]];

export enum MapboxMapStyle {
  dark = "dark",
  light = "light",
  satellite = "satellite",
  streets = "streets",
}

export enum BottomNavSheet {
  Menu = "MENU",
  Stoplist = "STOPLIST",
  Map = "Map",
}

export enum TourStyle {
  NEXT_STOP = "next_stop",
  ENTIRE_TOUR = "entire_tour",
}
