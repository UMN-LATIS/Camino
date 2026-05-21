/**
 * End-to-end checks for the public trekker app: tour discovery, stop navigation,
 * sheet interactions, and static routes. Uses the seeded public tours.
 */

describe("Trekker — tour discovery and navigation", () => {
  before(() => {
    // Trekker is read-only against the seeded data, so reset once for the file.
    cy.refreshDatabase();
    cy.seed();
  });

  it("lists seeded public tours on the trekker home", () => {
    cy.visit("/trekker/");
    cy.contains("Stone Arch Bridge", { timeout: 15000 }).should("exist");
    cy.contains("Chroma Zone Mural Tour").should("exist");
  });

  it("entering a tour from the home page lands on stops/0 with the first stop's title", () => {
    cy.visit("/trekker/");
    cy.contains("a", "Stone Arch Bridge", { timeout: 15000 }).click();

    cy.url().should("match", /\/trekker\/tours\/\d+\/stops\/0$/);
    cy.get("[data-cy=stop-title]", { timeout: 30000 }).should(
      "contain.text",
      "Stone Arch Bridge",
    );
  });

  it("the Continue button advances to the next stop", () => {
    cy.visit("/trekker/");
    cy.contains("a", "Stone Arch Bridge", { timeout: 15000 }).click();
    cy.get("[data-cy=stop-title]", { timeout: 30000 }).should("be.visible");

    cy.contains("button", "Continue").click();
    cy.url().should("match", /\/trekker\/tours\/\d+\/stops\/1$/);
    // Whatever the title is, it should render after navigation completes.
    cy.get("[data-cy=stop-title]", { timeout: 15000 }).should("be.visible");
  });

  it("the stop-list sheet navigates to an arbitrary stop", () => {
    cy.visit("/trekker/");
    cy.contains("a", "Stone Arch Bridge", { timeout: 15000 }).click();
    cy.get("[data-cy=stop-title]", { timeout: 30000 }).should("be.visible");

    // The progress button (middle of the bottom nav) opens the stop list.
    cy.get(".bottom-nav__progress-button").click();

    // Pick the third stop in the list (index 2) and click into it.
    cy.get(".stoplist__item")
      .eq(2)
      .invoke("text")
      .then((targetTitle) => {
        const trimmed = targetTitle.trim();
        cy.get(".stoplist__item").eq(2).click();
        cy.url().should("match", /\/trekker\/tours\/\d+\/stops\/2$/);
        cy.get("[data-cy=stop-title]", { timeout: 15000 })
          .invoke("text")
          .should((text) => {
            // The trekker title includes the stop number prefix; just assert the
            // human-readable portion of the stoplist label appears.
            const titleOnly = trimmed.replace(/^\s*\d+\s*/, "").trim();
            expect(text).to.contain(titleOnly);
          });
      });
  });

  it("the static settings page renders", () => {
    cy.visit("/trekker/settings");
    cy.contains(/settings/i, { timeout: 10000 }).should("exist");
  });

  it("the static help page renders", () => {
    cy.visit("/trekker/help");
    cy.contains(/help/i, { timeout: 10000 }).should("exist");
  });
});
