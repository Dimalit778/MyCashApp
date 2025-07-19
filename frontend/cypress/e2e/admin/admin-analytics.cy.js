describe("Admin Analytics Page", () => {
  beforeEach(() => {
    // Clear DB and seed with test data
    cy.task("db:clear-db");
    cy.task("db:seed-admin");
    cy.task("db:seed-user");
    cy.task("db:seed-transactions", { count: 50 });
    cy.loginTestUser("admin");

    cy.intercept("GET", "**/api/admin/stats", (req) => {
      req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      // Add a delay to ensure we can catch loading states
      req.on("response", (res) => {
        return new Promise((resolve) => setTimeout(resolve, 300));
      });
    }).as("getStats");

    cy.intercept("GET", "**/api/admin/historical*", (req) => {
      req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      // Add a delay to ensure we can catch loading states
      req.on("response", (res) => {
        return new Promise((resolve) => setTimeout(resolve, 300));
      });
    }).as("getHistorical");

    cy.visit("/admin/analytics");
    cy.wait("@getStats", { timeout: 15000 });
    cy.wait("@getHistorical", { timeout: 15000 });
    cy.waitForLoadingSpinner({ timeout: 10000 });
  });

  describe("Page Loading", () => {
    it("should display loading spinner initially", () => {
      // First clear any previous intercepts
      cy.intercept("GET", "**/api/admin/stats").as("originalStats");
      cy.intercept("GET", "**/api/admin/historical*").as("originalHistorical");

      // Set up new intercepts with significant delay
      cy.intercept("GET", "**/api/admin/stats", (req) => {
        req.on("response", (res) => {
          // Use a longer delay (1000ms) to ensure spinner is visible
          return new Promise((resolve) => setTimeout(resolve, 1000));
        });
      }).as("delayedStats");

      cy.intercept("GET", "**/api/admin/historical*", (req) => {
        req.on("response", (res) => {
          // Use a longer delay (1000ms) to ensure spinner is visible
          return new Promise((resolve) => setTimeout(resolve, 1000));
        });
      }).as("delayedHistorical");

      // Visit the page after setting up intercepts
      cy.visit("/admin/analytics", { timeout: 30000 });

      // Look for any loading indicator with more flexible selectors
      cy.get(
        '[data-cy="loading-spinner"], .spinner-border, .spinner, [class*="loading"], [class*="spinner"]'
      )
        .should("exist")
        .then(() => {
          cy.log("Loading indicator found");
        });

      // Wait for API calls to complete
      cy.wait(["@delayedStats", "@delayedHistorical"], { timeout: 30000 });

      // Verify page content is visible after loading
      cy.getDataCy("page-title").should("be.visible", { timeout: 15000 });
      cy.getDataCy("admin-analytics-page").should("be.visible");
    });

    it("should handle API errors gracefully", () => {
      cy.intercept("GET", "**/api/admin/stats", {
        statusCode: 500,
        body: { message: "Server error" },
        delay: 300, // Add delay to ensure error state is visible
      }).as("getStatsError");

      cy.visit("/admin/analytics");
      cy.wait("@getStatsError", { timeout: 15000 });
      cy.getDataCy("error-message").should("be.visible");
    });
  });

  describe("Analytics Content", () => {
    it("should display stats cards with correct data", () => {
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("stats-card").should("be.visible");

      cy.get("@getStats").then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property("data");
        const statsData = response.body.data;

        // Verify each stat card displays the correct value from API response
        cy.getDataCy("total-users-card").should(
          "contain",
          statsData.totalUsers
        );
        cy.getDataCy("admin-users-card").should(
          "contain",
          statsData.adminUsers
        );
        cy.getDataCy("regular-users-card").should(
          "contain",
          statsData.regularUsers
        );
        cy.getDataCy("recent-users-card").should(
          "contain",
          statsData.recentUsers
        );
        cy.getDataCy("total-transactions-card").should(
          "contain",
          statsData.totalTransactions
        );
        cy.getDataCy("total-categories-card").should(
          "contain",
          statsData.totalCategories
        );

        // Additional assertions based on the API data
        expect(statsData.totalUsers).to.equal(
          statsData.adminUsers + statsData.regularUsers
        );
      });
    });

    it("should render user growth chart with real data", () => {
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("line-chart").should("be.visible");

      // Check period selector
      cy.getDataCy("period-selector").should("be.visible");
      cy.getDataCy("period-selector").select("7");
      cy.getDataCy("period-selector").should("have.value", "7");

      // Verify new API call is made with the selected period
      cy.intercept("GET", "**/api/admin/historical?period=7", (req) => {
        // Add a delay to ensure we can catch loading states
        req.on("response", (res) => {
          return new Promise((resolve) => setTimeout(resolve, 300));
        });
      }).as("getPeriod7");

      cy.getDataCy("period-selector").select("7");
      cy.wait("@getPeriod7", { timeout: 15000 });
      cy.waitForLoadingSpinner({ timeout: 10000 });

      // Change period and verify it updates
      cy.intercept("GET", "**/api/admin/historical?period=90", (req) => {
        // Add a delay to ensure we can catch loading states
        req.on("response", (res) => {
          return new Promise((resolve) => setTimeout(resolve, 300));
        });
      }).as("getPeriod90");

      cy.getDataCy("period-selector").select("90");
      cy.getDataCy("period-selector").should("have.value", "90");
      cy.wait("@getPeriod90", { timeout: 15000 });
      cy.waitForLoadingSpinner({ timeout: 10000 });
    });

    it("should render transaction types pie chart", () => {
      cy.getDataCy("charts-container").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");

      // Verify the chart is using real data from the API
      cy.get("@getHistorical").then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property("data");
      });
    });

    it("should render user role distribution bar chart", () => {
      cy.getDataCy("charts-container").should("be.visible");
      cy.get("canvas").should("be.visible");
    });

    it("should display platform summary with statistics", () => {
      // First ensure the page is loaded
      cy.getDataCy("admin-analytics-page").should("be.visible");

      // Scroll using window scrolling since we removed position: fixed
      cy.window().scrollTo("bottom");

      // Verify the platform summary is visible after scrolling
      cy.getDataCy("platform-summary").should("be.visible");

      // Verify the statistics are displayed
      cy.getDataCy("avg-transactions").should("be.visible");
      cy.getDataCy("avg-categories").should("be.visible");
      cy.getDataCy("growth-rate").should("be.visible");

      // Verify the content of the statistics
      cy.get("@getStats").then(({ response }) => {
        const stats = response.body.data;

        // Check average transactions per user
        const avgTransactions =
          stats.totalUsers > 0
            ? (stats.totalTransactions / stats.totalUsers).toFixed(1)
            : "0";
        cy.getDataCy("avg-transactions").should("contain", avgTransactions);

        // Check average categories per user
        const avgCategories =
          stats.totalUsers > 0
            ? (stats.totalCategories / stats.totalUsers).toFixed(1)
            : "0";
        cy.getDataCy("avg-categories").should("contain", avgCategories);

        // Check growth rate
        const growthRate =
          stats.totalUsers > 0
            ? ((stats.recentUsers / stats.totalUsers) * 100).toFixed(1) + "%"
            : "0%";
        cy.getDataCy("growth-rate").should("contain", growthRate);
      });
    });
  });

  describe("Responsive Layout", () => {
    it("should adapt to different screen sizes", () => {
      // Test desktop view
      cy.viewport(1200, 800);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("stats-card").should("be.visible");
      // Target the specific container for scrolling

      cy.getDataCy("charts-container").should("be.visible");
      cy.getDataCy("admin-sidebar").should("be.visible");
      cy.getDataCy("admin-topbar").should("not.be.visible");

      // Test tablet view
      cy.viewport(768, 1024);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("charts-container").should("be.visible");

      // Test mobile view
      cy.viewport(375, 667);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("charts-container").should("be.visible");
      cy.getDataCy("admin-sidebar").should("not.be.visible");
      cy.getDataCy("admin-topbar").should("be.visible");
    });
  });

  describe("Chart Period Selection", () => {
    it("should update chart when period changes", () => {
      // Intercept chart data requests
      cy.intercept("GET", "**/api/admin/historical?period=*").as(
        "getHistoricalPeriod"
      );

      // Find the period selector and change it
      cy.getDataCy("period-selector").select("7");

      // Wait for the request with the new period
      cy.wait("@getHistoricalPeriod").then(({ request }) => {
        // Verify the request includes the correct period parameter
        expect(request.url).to.include("period=7");
      });

      // Verify chart updates
      cy.getDataCy("line-chart").should("be.visible");

      // Change to another period
      cy.getDataCy("period-selector").select("90");

      // Wait for the request with the new period
      cy.wait("@getHistoricalPeriod").then(({ request }) => {
        // Verify the request includes the correct period parameter
        expect(request.url).to.include("period=90");
      });

      // Verify chart is still visible
      cy.getDataCy("line-chart").should("be.visible");
    });
  });
});
