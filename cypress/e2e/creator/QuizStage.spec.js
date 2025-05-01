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

  it("adds a quiz stage", () => {
    // select a new stage
    cy.get("[data-cy='select-stage-type']").select("Quiz");

    // click add stage
    cy.contains("Add a Stage").click();

    // check that the stage is added to the stage list
    cy.get(".tour-stop-stage:last-of-type .card-title").should(
      "contain.text",
      "quiz"
    );

    cy.get('[data-cy="quiz-prompt-editor"]').type("What's the best color?");
    cy.get('[data-cy="quiz-prompt-editor"]').should(
      "contain.text",
      "What's the best color?"
    );

    cy.contains("Add response").click();
    cy.get(
      '[data-cy="quiz-response"]:eq(0) [data-cy="language-text-input"]'
    ).type("Red{enter}");

    cy.contains("Add response").click();
    cy.get(
      '[data-cy="quiz-response"]:eq(1) [data-cy="language-text-input"]'
    ).type("Green{enter}");

    cy.contains("Add response").click();
    cy.get(
      '[data-cy="quiz-response"]:eq(2) [data-cy="language-text-input"]'
    ).type("Blue{enter}");
    cy.get('[data-cy="quiz-response"]:eq(2)').contains("Correct").click();

    cy.contains("Save").click();
    cy.contains("Preview").click();
    cy.contains("Quiz").click();

    cy.get(".modal--is-open > .modal__contents").should("exist");
    cy.contains("What's the best color?");

    // selecting a incorrect response should show as incorrect
    cy.contains("Red").click();
    cy.get(".quiz-choice-button--incorrect").should("contain.text", "Red");

    // selecting a correct response should show as correct
    cy.contains("Blue").click();
    cy.get(".quiz-choice-button--correct").should("contain.text", "Blue");

    // and the other responses should be incorrect
    cy.get(".quiz-choice-button--incorrect").should("contain.text", "Green");

    // a success message should exist
    cy.get(".quiz-stage__footer > .success-message").should("exist");

    // clicking Done should close the modal
    cy.contains("Done").click();
    cy.get(".modal--is-open").should("not.exist");
  });
});
