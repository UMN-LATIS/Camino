/**
 * mock geolocation
 * @see https://github.com/cypress-io/cypress/issues/2671
 */
Cypress.Commands.add("mockGeolocation", (lnglat = { lng: 0, lat: 0 }) => {
  cy.window().then(($window) => {
    cy.stub($window.navigator.geolocation, "getCurrentPosition", (callback) => {
      return callback({
        coords: { latitude: lnglat.lat, longitude: lnglat.lng },
      });
    });
  });
});
