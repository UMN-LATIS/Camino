describe("My Tours Page", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    cy.visit("/creator");
  });

  it("shows a list of my tours", () => {
    cy.get("#app")
      .should("contain.text", "My Tours")
      .should("contain.text", "Stone Arch Bridge")
      .should("contain.text", "Chroma Zone Mural Tour");
  });

  it("creates a tour", () => {
    cy.contains("New Tour").click();
    cy.get("#new-title").type("Test Tour{enter}");
    cy.get("[data-cy=tour-list]").should("contain.text", "Test Tour");
  });

  it("deletes a tour", () => {
    // verify that the tour exists
    cy.contains("Stone Arch Bridge").should("exist");
    // get the 3rd tour, "Stone Arch Bridge"
    cy.get(":nth-child(3) > .card-body").contains("Delete").click();

    // verify that the tour is deleted
    cy.contains("Stone Arch Bridge").should("not.exist");
  });
});
