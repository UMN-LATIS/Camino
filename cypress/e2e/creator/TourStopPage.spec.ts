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

  it("adds a stop image", () => {
    // upload an image via the ImageUpload component
    cy.get("#image-upload-file").selectFile("cypress/fixtures/test-image.jpg", {
      force: true,
    });

    // the upload should succeed (not 500) and the preview image should appear
    // with a src pointing to the stored file
    cy.get(".image-upload__preview", { timeout: 20000 })
      .should("be.visible")
      .should("have.attr", "src")
      .and("match", /^\/storage\/.+\.jpg$/);

    // verify the image is actually served by the app (not 404/500)
    cy.get(".image-upload__preview")
      .invoke("attr", "src")
      .then((src) => {
        cy.request(src as string)
          .its("status")
          .should("eq", 200);
      });

    // save the stop and confirm the image persists after reload
    cy.contains("Save").click();
    cy.reload();
    cy.get(".image-upload__preview")
      .should("be.visible")
      .should("have.attr", "src")
      .and("match", /^\/storage\/.+\.jpg$/);
  });
  it("changes the stop image");
  it("removes a stop image");
  it("edits a separator stage title");
  it("removes a stage", () => {
    // check that guide stage is present
    cy.get("[data-cy='stage-title']")
      .contains("guide")
      .should("exist")
      // remove the guide stage
      .parents(".tour-stop-stage")
      .find('[data-cy="remove-stage-button"]')
      .click();

    // verify that the guide stage is gone
    cy.get("[data-cy='stage-title']").contains("guide").should("not.exist");
  });

  it("adds a stage", () => {
    // check that stages exists with default stages
    cy.get('[data-cy="tour-stop-stages"]')
      .should("contain.text", "Navigation")
      .should("contain.text", "Guide");

    // select a new stage
    cy.get("[data-cy='select-stage-type']").select("AR");

    // click add stage
    cy.contains("Add a Stage").click();

    // check that the stage is added to the stage list
    cy.get(".tour-stop-stage:last-of-type .card-title").should(
      "contain.text",
      "ar",
    );

    // check that the stage content appears on the stop page
    cy.contains("Save").click();
    cy.contains("Preview").click();
    cy.get(".ar-stage > .button").should("contain.text", "Look Around");
  });
  it("adds a stop location via the navigation stage");
});
