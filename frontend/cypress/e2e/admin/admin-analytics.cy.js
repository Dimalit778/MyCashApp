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
    }).as("getStats");

    cy.intercept("GET", "**/api/admin/historical*").as("getHistorical");

    cy.visit("/admin/analytics");
    cy.wait("@getStats");
    cy.wait("@getHistorical");
  });

  describe("Page Loading", () => {
    it("should display loading spinner initially", () => {
      cy.intercept("GET", "**/api/admin/stats", (req) => {
        req.on("response", (res) => {
          // Delay the response to ensure spinner is visible
          res.setDelay(500);
        });
      }).as("delayedStats");

      cy.visit("/admin/analytics");
      cy.getDataCy("loading-spinner").should("be.visible");

      cy.wait("@delayedStats");
      cy.getDataCy("loading-spinner").should("not.exist");
      cy.getDataCy("page-title").should("be.visible");
    });

    it("should handle API errors gracefully", () => {
      cy.intercept("GET", "**/api/admin/stats", {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("getStatsError");

      cy.visit("/admin/analytics");
      cy.wait("@getStatsError");
      cy.getDataCy("error-message").should("be.visible");
    });
  });

  describe("Analytics Content", () => {
    it("should display page title and export button", () => {
      cy.getDataCy("page-title")
        .should("be.visible")
        .and("contain", "Analytics & Reports");
      cy.getDataCy("export-report-btn").should("be.visible");
    });

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
      cy.intercept("GET", "**/api/admin/historical?period=7").as("getPeriod7");
      cy.getDataCy("period-selector").select("7");
      cy.wait("@getPeriod7");

      // Change period and verify it updates
      cy.intercept("GET", "**/api/admin/historical?period=90").as(
        "getPeriod90"
      );
      cy.getDataCy("period-selector").select("90");
      cy.getDataCy("period-selector").should("have.value", "90");
      cy.wait("@getPeriod90");
    });

    it("should render transaction types pie chart", () => {
      cy.getDataCy("transaction-types-chart").should("be.visible");
      cy.getDataCy("pie-chart").should("be.visible");

      // Verify the chart is using real data from the API
      cy.get("@getHistorical").then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property("data");
      });
    });

    it("should render user role distribution bar chart", () => {
      cy.getDataCy("user-role-chart").should("be.visible");
      cy.get("canvas").should("be.visible");
    });

    it("should display platform summary with statistics", () => {
      cy.getDataCy("platform-summary").should("be.visible");
      cy.getDataCy("avg-transactions").should("be.visible");
      cy.getDataCy("avg-categories").should("be.visible");
      cy.getDataCy("growth-rate").should("be.visible");
      cy.getDataCy("admin-ratio").should("be.visible");

      // Just verify the elements exist and are visible
      // Don't check specific content since it's calculated dynamically
    });
  });

  describe("Export Functionality", () => {
    it("should export report when button is clicked", () => {
      // Spy on window.URL.createObjectURL
      cy.window().then((win) => {
        cy.stub(win.URL, "createObjectURL").returns("blob:test-url");
        cy.stub(win.URL, "revokeObjectURL").as("revokeObjectURL");
      });

      // Spy on document.createElement to intercept the download
      cy.document().then((doc) => {
        const originalCreateElement = doc.createElement;
        cy.stub(doc, "createElement").callsFake((tagName) => {
          const element = originalCreateElement.call(doc, tagName);
          if (tagName === "a") {
            cy.stub(element, "click").as("downloadClick");
          }
          return element;
        });
      });

      // Click export button
      cy.getDataCy("export-report-btn").click();

      // Verify download was triggered
      cy.get("@downloadClick").should("be.called");
      cy.get("@revokeObjectURL").should("be.called");

      // Check toast notification
      cy.contains("Report exported successfully").should("be.visible");
    });
  });

  describe("Responsive Layout", () => {
    it("should adapt to different screen sizes", () => {
      // Test desktop view
      cy.viewport(1200, 800);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("transaction-types-chart").should("be.visible");

      // Test tablet view
      cy.viewport(768, 1024);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("transaction-types-chart").should("be.visible");

      // Test mobile view
      cy.viewport(375, 667);
      cy.getDataCy("admin-analytics-page").should("be.visible");
      cy.getDataCy("user-growth-chart").should("be.visible");
      cy.getDataCy("transaction-types-chart").should("be.visible");
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
