/**
 * Save → reload persistence tests for tours and stops.
 *
 * Existing creator specs assert optimistic UI updates but rarely reload from
 * the server. These tests force a hard reload so failures in the
 * normalize/denormalize boundary or in the save endpoints show up.
 */

describe("Tour save → reload persistence", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    cy.visit("/creator");
    cy.contains("New Tour").click();
    cy.get("#new-title").type("Persist Tour{enter}");
    cy.contains(".tour-list-item", "Persist Tour").contains("Edit").click();
  });

  it("persists tour title across a reload", () => {
    cy.get("#tourTitle").type("{selectAll}Renamed Tour");
    cy.get("[data-cy=save-button]").click();

    cy.reload();
    cy.get("[data-cy=tour-title]", { timeout: 15000 }).should(
      "contain.text",
      "Renamed Tour",
    );
  });

  it("persists transport mode toggles across a reload", () => {
    // Default new tour has all transports off. Turn Walking and Biking on.
    cy.contains("label", "Walking").find("input[type=checkbox]").check();
    cy.contains("label", "Biking").find("input[type=checkbox]").check();
    cy.get("[data-cy=save-button]").click();

    cy.reload();
    cy.contains("label", "Walking", { timeout: 15000 })
      .find("input[type=checkbox]")
      .should("be.checked");
    cy.contains("label", "Biking")
      .find("input[type=checkbox]")
      .should("be.checked");
    cy.contains("label", "Driving")
      .find("input[type=checkbox]")
      .should("not.be.checked");
  });

  it("persists a newly created stop across a reload", () => {
    cy.contains("New Stop").click();
    cy.get('[data-cy="add-stop-form"] input').type("Persistent Stop{enter}");

    cy.reload();
    cy.get('[data-cy="tour-stop-list"]', { timeout: 15000 }).should(
      "contain.text",
      "Persistent Stop",
    );
  });
});

describe("Stop save → reload persistence", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    cy.visit("/creator");
    cy.contains("New Tour").click();
    cy.get("#new-title").type("Stop Test Tour{enter}");
    cy.contains(".tour-list-item", "Stop Test Tour").contains("Edit").click();
    cy.contains("New Stop").click();
    cy.get('[data-cy="add-stop-form"] input').type("Initial Stop{enter}");
    cy.contains("Initial Stop").click();
  });

  it("persists stop title across a reload", () => {
    cy.get('[data-cy="stop-title-input-group"]').type(
      "{selectAll}Renamed Stop",
    );
    cy.contains("Save").click();

    cy.reload();
    cy.get('[data-cy="stop-title"]', { timeout: 15000 }).should(
      "contain.text",
      "Renamed Stop",
    );
  });

  it("persists an added stage across a reload", () => {
    // The default stop already has Navigation and Guide stages. Add an AR stage.
    cy.get("[data-cy='select-stage-type']").select("AR");
    cy.contains("Add a Stage").click();
    cy.contains("Save").click();

    cy.reload();
    cy.get('[data-cy="tour-stop-stages"]', { timeout: 15000 })
      .find("[data-cy='stage-title']")
      .should("contain.text", "ar");
  });

  it("persists a removed stage across a reload", () => {
    cy.get("[data-cy='stage-title']")
      .contains("guide")
      .parents(".tour-stop-stage")
      .find('[data-cy="remove-stage-button"]')
      .click();
    cy.contains("Save").click();

    cy.reload();
    cy.get('[data-cy="tour-stop-stages"]', { timeout: 15000 })
      .find("[data-cy='stage-title']")
      .each(($el) => {
        expect($el.text().toLowerCase()).not.to.contain("guide");
      });
  });
});

describe("Tour stops list persistence", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.login({ unique_id: "admin" });
    cy.visit("/creator");
    cy.contains("New Tour").click();
    cy.get("#new-title").type("Stops Order Tour{enter}");
    cy.contains(".tour-list-item", "Stops Order Tour").contains("Edit").click();
  });

  it("persists a deleted stop across a reload", () => {
    cy.contains("New Stop").click();
    cy.get('[data-cy="add-stop-form"] input').type("Disposable Stop{enter}");

    cy.get('[data-cy="tour-stop-list"]')
      .contains("Disposable Stop")
      .closest(".card-body")
      .contains("Delete")
      .click();

    cy.reload();
    cy.get('[data-cy="tour-stop-list"]', { timeout: 15000 }).should(
      "not.contain.text",
      "Disposable Stop",
    );
  });
});
