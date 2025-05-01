describe("Login Page", () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.seed();
    cy.visit("/");
  });

  it("requires login", () => {
    cy.visit("/creator");
    cy.get("#umn-main").should("contain.text", "Log In");

    // choose UMN login
    cy.get('[data-cy="login-options"]')
      .contains("University of Minnesota", { matchCase: false })
      .click();

    // login
    cy.get("#username").type("admin");
    cy.get("#password").type("admin");
    cy.get(".login-box [type=submit]").click();
  });
});
