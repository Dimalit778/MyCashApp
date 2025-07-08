import { adminRoutes } from "../../support/utils";
describe("Admin Routes and Access Control", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");
    cy.loginTestUser("admin");
  });

  describe("Admin User Redirection", () => {
    it("should redirect admin users from regular routes to admin analytics", () => {
      // Try to visit regular user routes
      const userRoutes = [
        "/home",
        "/transactions/expenses",
        "/settings",
        "/contact",
      ];

      userRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should("include", "/admin/analytics");
      });
    });

    it("should redirect to admin analytics when visiting root as admin", () => {
      cy.visit("/");
      cy.url().should("include", "/admin/analytics");
    });
  });

  describe("Navigation Between Admin Routes", () => {
    beforeEach(() => {
      cy.visit("/admin/analytics");
    });

    it("should navigate through all admin pages via sidebar (desktop)", () => {
      cy.viewport(1200, 800);
      adminRoutes.forEach((route) => {
        cy.getDataCy(route.dataCy).click();
        cy.url().should("include", route.path);
        cy.contains("h1", route.title).should("be.visible");
      });
    });

    it("should navigate through all admin pages via sidebar (mobile)", () => {
      cy.viewport(375, 667);

      adminRoutes.forEach((route) => {
        cy.getDataCy("admin-topBar-hamburger").click();
        cy.getDataCy("admin-sideBar").should("be.visible");
        cy.getDataCy(route.dataCy).filter(":visible").click(); // Filter for visible elements
        cy.url().should("include", route.path);
        cy.contains("h1", route.title).should("be.visible");
        cy.getDataCy("admin-sideBar").should("not.be.visible");
      });
    });
  });

  describe("Deep Navigation", () => {
    beforeEach(() => {
      cy.task("db:seed-user");
    });

    it("should navigate to user details page and back", () => {
      cy.visit("/admin/users");

      // Wait for users to load
      cy.contains("User Management").should("be.visible");

      // Click on first user's view button
      cy.getDataCy("user-details-btn").first().click();

      // Should be on user details page
      cy.url().should("match", /\/admin\/users\/[a-f0-9]{24}$/);
      cy.contains("User Details").should("be.visible");

      // Navigate back using back button

      cy.getDataCy("admin-user-details-back-button")
        .should("be.visible")
        .click();
      cy.url().should("include", "/admin/users");
      cy.contains("User Management").should("be.visible");
    });
  });

  describe("Browser Navigation", () => {
    beforeEach(() => {
      cy.loginTestUser("admin");
    });

    it("should handle browser back/forward navigation correctly", () => {
      // Start at analytics
      cy.visit("/admin/analytics");
      cy.contains("Analytics & Reports").should("be.visible");

      // Navigate to users
      cy.getDataCy("nav-users").click();
      cy.contains("User Management").should("be.visible");

      // Navigate to categories
      cy.getDataCy("nav-categories").click();
      cy.contains("Default Categories").should("be.visible");

      // Use browser back button
      cy.go("back");
      cy.url().should("include", "/admin/users");
      cy.contains("User Management").should("be.visible");

      // Use browser back again
      cy.go("back");
      cy.url().should("include", "/admin/analytics");
      cy.contains("Analytics & Reports").should("be.visible");

      // Use browser forward button
      cy.go("forward");
      cy.url().should("include", "/admin/users");
      cy.contains("User Management").should("be.visible");
    });
  });

  describe("Invalid Routes", () => {
    it("should redirect invalid admin routes to analytics page", () => {
      const invalidRoutes = [
        "/admin/todo",
        "/admin/invalid",
        "/admin/not-found",
        "/admin/settings",
      ];

      invalidRoutes.forEach((route) => {
        cy.visit(route, { failOnStatusCode: false });
        // Should redirect to analytics as default admin page
        cy.url().should("include", "/admin/analytics");
      });
    });

    it("should handle invalid user ID in user details route", () => {
      cy.visit("/admin/users/invalid-id", { failOnStatusCode: false });
      // Should show error or redirect
      cy.url().should("satisfy", (url) => {
        return url.includes("/admin/users") || url.includes("/admin/analytics");
      });
    });
  });

  describe("Session Persistence", () => {
    it("should maintain admin session across page reloads", () => {
      cy.visit("/admin/analytics");
      cy.contains("Analytics & Reports").should("be.visible");

      // Reload the page
      cy.reload();

      // Should still be on admin analytics page
      cy.url().should("include", "/admin/analytics");
      cy.contains("Analytics & Reports").should("be.visible");
    });

    it("should redirect to landing page after logout", () => {
      cy.visit("/admin/analytics");
      // Logout from desktop view
      cy.viewport(1200, 800);
      cy.getDataCy("admin-sidebar-logout-button").click();

      // Should be redirected to landing page
      cy.url().should("eq", Cypress.config().baseUrl + "/");

      // Try to access admin route after logout
      cy.visit("/admin/analytics");
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });
});
describe("Route Protection", () => {
  it("should redirect unauthenticated users to landing page", () => {
    // Try to access admin routes without authentication
    const adminRoutes = [
      "/admin/analytics",
      "/admin/users",
      "/admin/categories",
      "/admin/database",
      "/admin/users/123",
    ];

    adminRoutes.forEach((route) => {
      cy.visit(route);
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  it("should redirect regular users to home page", () => {
    cy.task("db:seed-user");
    cy.loginTestUser("user");

    // Try to access admin routes
    const adminRoutes = [
      "/admin/analytics",
      "/admin/users",
      "/admin/categories",
      "/admin/database",
    ];

    adminRoutes.forEach((route) => {
      cy.visit(route);
      cy.url().should("include", "/home");
    });
  });

  it("should allow admin users to access all admin routes", () => {
    // Login as admin
    cy.loginTestUser("admin");

    // Access all admin routes
    const adminRoutes = [
      { path: "/admin/analytics", title: "Analytics & Reports" },
      { path: "/admin/users", title: "User Management" },
      { path: "/admin/categories", title: "Default Categories" },
      { path: "/admin/database", title: "Database" },
    ];

    adminRoutes.forEach((route) => {
      cy.visit(route.path);
      cy.url().should("include", route.path);
      cy.contains("h1", route.title).should("be.visible");
    });
  });
});
