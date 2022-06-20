describe("Tour Stop Page", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    cy.visit("/creator");
    cy.contains("New Tour").click();

    // create a new test tour for editing
    cy.get("#new-title").type("Test Tour{enter}");
    cy.contains("Test Tour")
      .closest(".tour-list-item")
      .contains("Edit")
      .click();

    // create a new tour stop
    cy.contains("New Stop").click();
    cy.get('[data-cy="add-stop-form"] input').type("Test Stop{enter}");
    cy.contains("Test Stop").click();
  });

  it("changes the stop name", () => {
    cy.get('[data-cy="stop-title"]').should("contain.text", "Test Stop");
    cy.get('[data-cy="stop-title-input-group"]').type("{selectAll}Stop 1");
    cy.contains("Save").click();
    cy.get('[data-cy="stop-title"]').should("contain.text", "Stop 1");

    // Preview the stop should show the new stop name
    cy.contains("Preview").click();
    cy.get('[data-cy="stop-title"]').should("contain.text", "Stop 1");
    cy.go("back");

    // check that the Tour Page also shows the new stop name
    cy.contains("Back to Tour").click();
    cy.get('[data-cy="tour-stop-list"]')
      .should("contain.text", "Stop 1")
      .should("not.contain.text", "Test Stop");
  });

  it("adds a stop subtitle");

  it("adds a stop image");
  it("changes the stop image");
  it("removes a stop image");
  it("edits a separator stage title");
  it("removes a stage");
  it("adds a stage");
  it("adds a stop location via the navigation stage");
});
