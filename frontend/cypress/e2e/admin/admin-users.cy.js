describe("Admin User Management", () => {
  beforeEach(() => {
    // Set up the database
    cy.task("db:clear-db");
    cy.task("db:seed-admin");
    cy.task("db:seed-user");

    // Login as admin
    cy.loginTestUser("admin");

    // Set up intercept before visiting the page
    cy.intercept("GET", "**/api/admin/all**", (req) => {
      // Add a delay to ensure we can catch loading states
      req.on("response", (res) => {
        return new Promise((resolve) => setTimeout(resolve, 300));
      });
    }).as("getUsers");

    // Visit the admin users page
    cy.visit("/admin/users");

    // Wait for the API call to complete
    cy.wait("@getUsers", { timeout: 15000 });
  });

  it("should display the user management page with users", () => {
    // Check for loading spinner first
    cy.waitForLoadingSpinner({ timeout: 10000 });

    // Check page title
    cy.contains("h1", "User Management").should("be.visible");

    // Check that the table is visible
    cy.getDataCy("users-table").should("be.visible");

    // Check that user rows are displayed
    cy.getDataCy("user-row").should("have.length.at.least", 1);
  });

  it("should allow searching for users", () => {
    // Wait for loading to complete
    cy.waitForLoadingSpinner({ timeout: 10000 });

    // Type in the search box
    cy.getDataCy("search-users-input").find("input").type("admin");

    // Check that results are filtered
    cy.getDataCy("user-row").should("have.length.at.least", 1);
  });

  it("should filter users by role", () => {
    // Wait for loading to complete
    cy.waitForLoadingSpinner({ timeout: 10000 });

    // Click the role filter dropdown
    cy.getDataCy("role-filter-dropdown").click();

    // Select admin filter
    cy.contains("Admin").click();

    // Check that results are filtered
    cy.getDataCy("user-row").should("have.length.at.least", 1);
  });

  it("should navigate to user details page", () => {
    // Wait for loading to complete
    cy.waitForLoadingSpinner({ timeout: 10000 });

    // Click the view button on the first user
    cy.getDataCy("user-view-btn").first().click({ force: true });

    // Check that we navigated to the user details page
    cy.url().should("include", "/admin/users/");
    cy.contains("User Details").should("be.visible");
  });
});
