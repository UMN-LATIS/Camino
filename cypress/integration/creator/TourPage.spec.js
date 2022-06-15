describe("Tour Page", () => {
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
  });

  it("changes the tour name", () => {
    cy.contains("Test Tour").should("exist");

    // replace title with "Updated Test Tour"
    cy.get("#tourTitle").type("{selectAll}Updated");
    cy.contains("Save").click();

    // tour title on page should match new title
    cy.get("[data-cy=tour-title]").should("contain.text", "Updated");

    // tour title on the my tours page should match new title
    cy.contains("My Tours").click();
    cy.contains("Updated").should("exist");
    cy.contains("Test Tour").should("not.exist");
  });
  it("sets the tour language to spanish");
  it("sets the starting location");
  it("sets the tour as public");
  it("sets the tour as active");
  it("creates a new tour stop");
  it("deletes a tour stop");
  it("reorders a tour stop");
});
