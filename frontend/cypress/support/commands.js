import "cypress-file-upload";

Cypress.Commands.add("loginTestUser", (role = "user") => {
  const apiUrl = Cypress.env("API_URL");
  const email =
    role === "admin"
      ? Cypress.env("TEST_ADMIN_EMAIL")
      : Cypress.env("TEST_EMAIL");
  const password =
    role === "admin"
      ? Cypress.env("TEST_ADMIN_PASSWORD")
      : Cypress.env("TEST_PASSWORD");

  console.log("email", email);
  console.log("password", password);
  cy.request({
    method: "POST",
    url: `${apiUrl}/api/auth/login`,
    failOnStatusCode: false, // Don't fail immediately
    body: {
      email: email,
      password: password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const { accessToken, user } = response.body.data;
    cy.setCookie("token", accessToken);

    // Set up Redux store
    cy.window().then((win) => {
      win.localStorage.setItem(
        "persist:root",
        JSON.stringify({
          user: JSON.stringify({ user }),
        })
      );
    });
  });
});

Cypress.Commands.add("logout", () => {
  cy.clearCookie("token");
  cy.clearCookie("persist:root");
});

Cypress.Commands.add("getDataCy", (dataTestSelector) => {
  return cy.get(`[data-cy="${dataTestSelector}"]`);
});
// Helper command for viewport testing
Cypress.Commands.add("testViewport", (testCallback) => {
  // Desktop viewport
  cy.viewport(
    Cypress.config("viewportWidth"),
    Cypress.config("viewportHeight")
  );
  testCallback("desktop");

  // Mobile viewport
  cy.viewport(Cypress.env("mobileViewportWidthBreakpoint"), 667);
  testCallback("mobile");
});

Cypress.Commands.add("testResponsiveLayout", () => {
  // Test desktop layout
  cy.viewport(1200, 800);
  cy.getDataCy("top-bar").should("not.be.visible");
  cy.getDataCy("left-sidebar").should("be.visible");
  cy.getDataCy("bottom-nav").should("not.be.visible");

  // Test mobile layout
  cy.viewport(375, 667);
  cy.getDataCy("top-bar").should("be.visible");
  cy.getDataCy("left-sidebar").should("not.be.visible");
  cy.getDataCy("bottom-nav").should("be.visible");
});
