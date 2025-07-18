const navLinks = [
  {
    name: "Expenses",
    route: "/transactions/expenses",
    dataCy: "link-expenses",
  },
  { name: "Incomes", route: "/transactions/incomes", dataCy: "link-incomes" },
  { name: "Contact", route: "/contact", dataCy: "link-contact" },
  { name: "Settings", route: "/settings", dataCy: "link-settings" },
  { name: "Home", route: "/home", dataCy: "link-home" },
];
describe("Main Layout", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.intercept("GET", "**/api/transactions/yearly*", {
      statusCode: 200,
      body: {
        data: {
          monthlyStats: [],
          yearlyStats: {
            totalExpenses: 0,
            totalIncomes: 0,
            totalBalance: 0,
          },
        },
      },
    }).as("yearlyData");

    cy.intercept("GET", "**/api/transactions/monthly*", {
      statusCode: 200,
      body: {
        data: {
          transactions: [],
          total: 0,
        },
      },
    }).as("monthlyData");

    cy.intercept("GET", "**/api/categories/get*", {
      statusCode: 200,
      body: {
        data: {
          categories: [],
          maxCategories: 10,
        },
      },
    }).as("categoriesData");

    cy.loginTestUser();
    cy.visit("/home");

    // Hide the device frame toggle that might be covering UI elements
    cy.window().then((win) => {
      cy.document().then((doc) => {
        const deviceFrameToggle = doc.querySelector(".device-frame-toggle");
        if (deviceFrameToggle) {
          deviceFrameToggle.style.display = "none";
        }
      });
    });
  });

  describe("Desktop Layout", () => {
    beforeEach(() => {
      cy.viewport(
        Cypress.config("viewportWidth"),
        Cypress.config("viewportHeight")
      );
    });

    it("should display correct layout and sidebar elements", () => {
      cy.getDataCy("left-sidebar-container").should("be.visible");
      cy.getDataCy("top-bar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("left-sidebar").within(() => {
        cy.getDataCy("brand-logo").should("be.visible");
        cy.getDataCy("profile-image-container").should("be.visible");
        cy.getDataCy("user-name")
          .should("be.visible")
          .and("contain", "Test User");
        cy.getDataCy("user-email")
          .should("be.visible")
          .and("contain", "cypress@gmail.com");

        navLinks.forEach((link) => {
          cy.getDataCy(`nav-${link.dataCy}`).should("be.visible");
        });

        cy.getDataCy("left-sidebar-logout-button").should("be.visible");
      });
    });

    it("should navigate through sidebar links", () => {
      cy.getDataCy("left-sidebar").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-${link.dataCy}`).click();
          cy.url().should("include", link.route);
          cy.getDataCy(`nav-${link.dataCy}`)
            .should("have.css", "background-color")
            .and("not.equal", "transparent");
        });
      });
    });

    it("should handle logout from sidebar", () => {
      cy.getDataCy("left-sidebar-logout-button").click();
      cy.url().should("include", "/");
    });
  });

  describe("Mobile Layout", () => {
    beforeEach(() => {
      cy.viewport(375, 667);

      // Ensure device frame toggle is hidden for mobile tests
      cy.document().then((doc) => {
        const deviceFrameToggle = doc.querySelector(".device-frame-toggle");
        if (deviceFrameToggle) {
          deviceFrameToggle.style.display = "none";
        }
      });
    });

    it("should display correct mobile layout elements", () => {
      cy.getDataCy("left-sidebar-container").should("not.be.visible");
      cy.getDataCy("top-bar").should("be.visible");
      cy.getDataCy("bottom-nav").should("be.visible", { timeout: 10000 });
      cy.getDataCy("main-layout-outlet").should("be.visible");

      cy.getDataCy("top-bar").within(() => {
        cy.getDataCy("app-logo-link-to-home").should("be.visible");
        cy.getDataCy("top-bar-profile-image").should("be.visible");
        cy.getDataCy("top-bar-logout-button").should("be.visible");
      });

      cy.getDataCy("bottom-nav").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).should("be.visible");
        });
      });
    });

    it("should navigate through bottom nav links", () => {
      // Make sure bottom nav is visible first
      cy.getDataCy("bottom-nav").should("be.visible", { timeout: 10000 });

      // Use force: true to click even if covered
      cy.getDataCy("bottom-nav").within(() => {
        navLinks.forEach((link) => {
          cy.getDataCy(`nav-link-${link.name}`).click({ force: true });
          cy.url().should("include", link.route);
          cy.getDataCy(`nav-link-${link.name}`)
            .should("have.css", "background-color")
            .and("not.equal", "transparent");
        });
      });
    });

    it("should handle logout from top bar", () => {
      cy.getDataCy("top-bar-logout-button").click();
      cy.url().should("include", "/");
    });
  });

  describe("Responsive Behavior", () => {
    it("should adapt layout based on viewport size", () => {
      // Desktop view
      cy.viewport(1280, 720);
      cy.getDataCy("left-sidebar").should("be.visible");
      cy.getDataCy("bottom-nav").should("not.be.visible");

      // Mobile view
      cy.viewport(375, 667);

      // Ensure device frame toggle is hidden
      cy.document().then((doc) => {
        const deviceFrameToggle = doc.querySelector(".device-frame-toggle");
        if (deviceFrameToggle) {
          deviceFrameToggle.style.display = "none";
        }
      });

      cy.getDataCy("left-sidebar").should("not.be.visible");
      cy.getDataCy("bottom-nav").should("be.visible", { timeout: 10000 });
    });
  });
  describe("Loading States", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/transactions/yearly*", (req) => {
        req.on("response", (res) => {
          res.setDelay(300); // Add delay to see loading state
        });
      }).as("yearlyData");

      cy.intercept("GET", "**/api/transactions/monthly*", (req) => {
        req.on("response", (res) => {
          res.setDelay(300);
        });
      }).as("monthlyData");

      cy.intercept("GET", "**/api/categories/get*", (req) => {
        req.on("response", (res) => {
          res.setDelay(300);
        });
      }).as("categoriesData");
    });

    it("should show loading overlay on Home page", () => {
      cy.visit("/home");
      cy.getDataCy("loading-overlay").should("be.visible");
      cy.wait("@yearlyData");
      cy.getDataCy("loading-overlay").should("not.exist");
    });

    it("should show loading overlay on Transactions page", () => {
      cy.visit("/transactions/expenses");
      cy.getDataCy("loading-overlay").should("be.visible");
      cy.wait(["@monthlyData", "@categoriesData"]);
      cy.getDataCy("loading-overlay").should("not.exist");
    });

    it("should show loading overlay when navigating between Expenses and Incomes", () => {
      cy.visit("/transactions/expenses");
      cy.wait(["@monthlyData", "@categoriesData"]);

      cy.getDataCy("nav-link-incomes").click();
      cy.getDataCy("loading-overlay").should("be.visible");
      cy.wait("@monthlyData");
      cy.getDataCy("loading-overlay").should("not.exist");
    });

    it("should show loading overlay when changing month", () => {
      cy.visit("/transactions/expenses");
      cy.wait(["@monthlyData", "@categoriesData"]);

      cy.getDataCy("calendar-next-button").click();
      cy.getDataCy("loading-overlay").should("be.visible");
      cy.wait("@monthlyData");
      cy.getDataCy("loading-overlay").should("not.exist");
    });
  });
});
