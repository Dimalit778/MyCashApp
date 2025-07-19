describe("Admin User Details Page", () => {
  let testUserId;

  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", { count: 30 });
    cy.loginTestUser("admin");
  });

  // This test will ensure we can navigate from the users list to a specific user's details
  describe("Navigation from Users List", () => {
    it("should navigate to user details from users list", () => {
      // Intercept API calls with delay
      cy.intercept("GET", "**/api/admin/all**", (req) => {
        req.on("response", (res) => {
          return new Promise((resolve) => setTimeout(resolve, 300));
        });
      }).as("getUsers");

      cy.visit("/admin/users");
      cy.wait("@getUsers", { timeout: 5000 });
      cy.waitForLoadingSpinner({ timeout: 2000 });

      cy.getDataCy("users-table").should("be.visible");

      // First get the user ID from the API
      cy.request({
        method: "GET",
        url: `${
          Cypress.env("API_URL") || "http://localhost:8080"
        }/api/admin/all?limit=10&page=1`,
      }).then((response) => {
        // Find the test user or use the first user
        const users = response.body.data.users;
        const testUser =
          users.find((user) =>
            (user.firstName + " " + user.lastName).includes("Test User")
          ) || users[0];

        testUserId = testUser._id;

        // Intercept user details API call
        cy.intercept("GET", `**/api/admin/user/${testUserId}`, (req) => {
          req.on("response", (res) => {
            return new Promise((resolve) => setTimeout(resolve, 300));
          });
        }).as("getUserDetails");

        // Intercept user transactions API call
        cy.intercept(
          "GET",
          `**/api/admin/user/${testUserId}/transactions**`,
          (req) => {
            req.on("response", (res) => {
              return new Promise((resolve) => setTimeout(resolve, 300));
            });
          }
        ).as("getUserTransactions");

        // Now visit the user details page directly
        cy.visit(`/admin/users/${testUserId}`);

        // Wait for API calls to complete
        cy.wait("@getUserDetails", { timeout: 5000 });
        cy.wait("@getUserTransactions", { timeout: 5000 });
        cy.waitForLoadingSpinner({ timeout: 2000 });

        // Verify we're on the right page
        cy.contains("h1", "User Details").should("be.visible");
        cy.url().should("include", `/admin/users/${testUserId}`);
      });
    });
  });

  describe("User Details Content", () => {
    beforeEach(() => {
      // Get the test user ID first
      cy.request({
        method: "GET",
        url: `${
          Cypress.env("API_URL") || "http://localhost:8080"
        }/api/admin/all?limit=10&page=1`,
      }).then((response) => {
        const users = response.body.data.users;
        const testUser =
          users.find((user) =>
            (user.firstName + " " + user.lastName).includes("Test User")
          ) || users[0];

        testUserId = testUser._id;

        // Intercept user details API calls
        cy.intercept("GET", `**/api/admin/user/${testUserId}`, (req) => {
          req.on("response", (res) => {
            return new Promise((resolve) => setTimeout(resolve, 300));
          });
        }).as("getUserDetails");

        cy.intercept(
          "GET",
          `**/api/admin/user/${testUserId}/transactions**`,
          (req) => {
            req.on("response", (res) => {
              return new Promise((resolve) => setTimeout(resolve, 300));
            });
          }
        ).as("getUserTransactions");

        // Visit the page with the user ID
        cy.visit(`/admin/users/${testUserId}`);

        // Wait for API calls to complete
        cy.wait("@getUserDetails", { timeout: 5000 });
        cy.wait("@getUserTransactions", { timeout: 5000 });
        cy.waitForLoadingSpinner({ timeout: 2000 });
      });
    });

    it("should display user profile information", () => {
      cy.getDataCy("user-profile-image").should("be.visible");
      // Check for basic user info
      cy.contains("Test User").should("be.visible");
      cy.contains("cypress@gmail.com").should("be.visible");

      // Check for role badge
      cy.get(".badge").contains("user").should("be.visible");

      // Check for joined date
      cy.contains("Joined:").should("be.visible");

      // Check for user image
    });

    it("should display user statistics", () => {
      // Check for transaction count
      cy.contains("Transactions:").should("be.visible");
      cy.contains("Categories:").should("be.visible");
    });

    it("should have back button to return to users list", () => {
      // Find and click the back button
      cy.getDataCy("admin-user-details-back-button").click();

      // Verify we returned to the users list
      cy.url().should("include", "/admin/users");
      cy.contains("User Management").should("be.visible");
    });
  });

  describe("User Categories Section", () => {
    beforeEach(() => {
      // Set up user ID and visit page
      cy.request({
        method: "GET",
        url: `${
          Cypress.env("API_URL") || "http://localhost:8080"
        }/api/admin/all?limit=10&page=1`,
      }).then((response) => {
        const users = response.body.data.users;
        const testUser =
          users.find((user) =>
            (user.firstName + " " + user.lastName).includes("Test User")
          ) || users[0];

        testUserId = testUser._id;
        cy.visit(`/admin/users/${testUserId}`);
      });
    });

    it("should display user categories table", () => {
      // Check for categories section
      cy.contains("User Categories").should("be.visible");

      // Check for table headers
      cy.contains("th", "Name").should("be.visible");
      cy.contains("th", "Type").should("be.visible");
      cy.contains("th", "Created").should("be.visible");
    });
  });

  describe("User Transactions Section", () => {
    beforeEach(() => {
      // Set up user ID and visit page
      cy.request({
        method: "GET",
        url: `${
          Cypress.env("API_URL") || "http://localhost:8080"
        }/api/admin/all?limit=10&page=1`,
      }).then((response) => {
        const users = response.body.data.users;
        const testUser =
          users.find((user) =>
            (user.firstName + " " + user.lastName).includes("Test User")
          ) || users[0];

        testUserId = testUser._id;
        cy.visit(`/admin/users/${testUserId}`);
      });
    });

    it("should display transactions with tabs", () => {
      // Check for transaction tabs
      cy.contains("Expenses").should("be.visible");
      cy.contains("Income").should("be.visible");
    });

    it("should display transaction table with correct columns", () => {
      // Check for table headers
      cy.contains("th", "Date").should("be.visible");
      cy.contains("th", "Description").should("be.visible");
      cy.contains("th", "Category").should("be.visible");
      cy.contains("th", "Amount").should("be.visible");
    });
  });
});
