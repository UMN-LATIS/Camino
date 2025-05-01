describe("Home Page", () => {
  it("gets the home page", () => {
    cy.visit("/");
    cy.get('[data-cy="home-page-hero"]').should("contain.text", "Camino");
  });

  it("finds public tours", () => {
    cy.visit("/");

    cy.get('[data-cy="find-tour-link"]').click();
    cy.url().should("eq", Cypress.config().baseUrl + "/findTours");

    // show a tour map with tiles
    // cy.get("#map .leaflet-tile img")
    //   .should("be.visible")
    //   .and(($img) => {
    //     expect($img[0].naturalWidth).to.be.greaterThan(0);
    //   });

    // list public tours
    cy.get(".find-tour-page > .container")
      .should("contain.text", "Public Tours")
      .should("contain.text", "Stone Arch Bridge")
      .should("contain.text", "Chroma Zone Mural Tour")
      .should("not.contain.text", "Default Tour"); // private tour
  });
});
