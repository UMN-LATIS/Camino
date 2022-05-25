/**
 * Contains typescript-like typedefs
 * use triple-slash /// directive to use
 * in another file
 *
 * @example
 * /// <reference path="./types.js" />
 *
 * @see
 * https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
 */

/**
 * @typedef {Object} LngLat
 * @property {number} lng - Longitude
 * @property {number} lat - Latitude
 */
export interface LngLat {
  lng: number;
  lat: number;
}

/**
 * @typedef {Object.<string, string>} LocalizedString
 * @example
 * { 'en': 'Hello', 'es': 'Hola' }
 */
export interface LocalizedString {
  [localeCode: string]: string;
}

/**
 * @typedef {Object} ARWaypoint
 * @property {LocalizedString} text
 * @property {(number|null)} [altitude=null]
 * @property {LngLat} location
 */
export interface ARWaypoint {
  text: LocalizedString;
  altitude: Maybe<number>;
  location: LngLat;
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Maybe<T> = T | null;
