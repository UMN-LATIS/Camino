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

  it("deletes a tour");
  it("changes the tour name");
  it("sets the tour language to spanish");
  it("sets the starting location");
  it("sets the tour as public");
  it("sets the tour as active");
  it("creates a new tour");
  it("deletes a tour");
  it("opens a preview link");
  it("shows tour feedback");
});
