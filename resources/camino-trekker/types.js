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

/**
 * @typedef {Object.<string, string>} LocalizedString
 * @example
 * { 'en': 'Hello', 'es': 'Hola' }
 */

/**
 * @typedef {Object} ARWaypoint
 * @property {LocalizedString} text
 * @property {(number|null)} [altitude=null]
 * @property {LngLat} location
 */
