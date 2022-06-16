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

  it("adds spanish as tour language", () => {
    // expect the tour language to be english by default
    cy.get('[data-cy="select-languages-input-group');

    // change the tour language to spanish
    cy.get('[data-cy="select-languages-input-group')
      .contains("Español")
      .click();

    cy.get('[data-cy="select-languages-input-group')
      .contains("English")
      .click();

    cy.contains("Save").click();

    // expect the tour language to be spanish
    // so there should be two fields for each stop
    // check the first stop
    cy.get('[data-cy="tour-stop-list"] :nth-child(1) > .card-body')
      .contains("Edit")
      .click();

    // expect that the Stop title has beoth English and Spanish fields
    cy.contains("Stop Title (Español)").should("exist");
    cy.contains("Stop Title (English)").should("not.exist");
  });

  it("has a default location of UMN", () => {
    cy.get('[data-cy="tour-location-lng"]').should(
      "contain.text",
      "-93.234375"
    );
    cy.get('[data-cy="tour-location-lat"]').should("contain.text", "44.975876");
  });

  it("sets the starting location", () => {
    cy.contains("Set Location").click();

    // expect the modal to be visible
    cy.get("#setLocation").should("exist");

    // click on a location
    cy.get("#setLocation #map").click(100, 200);
    cy.get("#setLocation").contains("Done").click();

    // new location should be set
    cy.get('[data-cy="tour-location-lng"]').should("contain.text", "-93.23723");
    cy.get('[data-cy="tour-location-lat"]').should("contain.text", "44.97858");
  });

  it("sets the tour as public");
  it("sets the tour as active");
  it("creates a new tour stop");
  it("deletes a tour stop");
  it("reorders a tour stop");
});
