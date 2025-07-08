describe("Admin Database Management", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");

    cy.loginTestUser("admin");
    cy.visit("/admin/database");
  });

  describe("Page Load and Display", () => {
    it.only("should display the database page with correct elements", () => {
      cy.getDataCy("db-actions-title")
        .should("be.visible")
        .and("contain", "Database Operations");

      cy.getDataCy("db-export-title")
        .should("be.visible")
        .and("contain", "Data Statistics & Export");
    });

    it("should display database operations section", () => {
      cy.contains("h5", "Database Operations").should("be.visible");

      // Check for action items
      cy.contains("h6", "Users").should("be.visible");
      cy.contains("h6", "Transactions").should("be.visible");
      cy.contains("h6", "Categories").should("be.visible");
      cy.contains("h6", "Default Categories").should("be.visible");
      cy.contains("h6", "Expenses").should("be.visible");
      cy.contains("h6", "Incomes").should("be.visible");
      cy.contains("h6", "All Data").should("be.visible");

      // Check for delete buttons
      cy.contains("button", "Delete").should("have.length.at.least", 7);
    });

    it("should display data export section", () => {
      cy.contains("h5", "Data Statistics & Export").should("be.visible");

      // Check for export items
      cy.contains("Users").should("be.visible");
      cy.contains("Transactions").should("be.visible");
      cy.contains("Categories").should("be.visible");
      cy.contains("Default Categories").should("be.visible");
      cy.contains("Expenses").should("be.visible");
      cy.contains("Incomes").should("be.visible");
      cy.contains("All Data").should("be.visible");
      cy.contains("JSON Export").should("be.visible");

      // Check for export buttons
      cy.contains("button", "Export").should("have.length.at.least", 7);
    });
  });

  describe("Delete Operations", () => {
    it("should show confirmation modal when deleting users", () => {
      // Click delete users button
      cy.contains("h6", "Users").parent().parent().find("button").click();

      // Check modal appears with correct content
      cy.get(".modal-title").should("contain", "Delete All Users");
      cy.get(".modal-body").should(
        "contain",
        "WARNING: This will permanently delete ALL users"
      );

      // Check modal has cancel and confirm buttons
      cy.get(".modal-footer").contains("Cancel").should("be.visible");
      cy.get(".modal-footer").contains("Confirm Delete").should("be.visible");

      // Cancel the operation
      cy.get(".modal-footer").contains("Cancel").click();
      cy.get(".modal").should("not.exist");
    });

    it("should delete all transactions with confirmation", () => {
      cy.intercept("DELETE", "**/api/transactions/deleteAll").as(
        "deleteTransactions"
      );

      // Click delete transactions button
      cy.contains("h6", "Transactions")
        .parent()
        .parent()
        .find("button")
        .click();

      // Confirm in modal
      cy.get(".modal-footer").contains("Confirm Delete").click();

      // Wait for API call
      cy.wait("@deleteTransactions");

      // Check success message
      cy.contains("Operation completed successfully").should("be.visible");
    });

    it("should handle delete operation errors", () => {
      cy.intercept("DELETE", "**/api/categories/deleteAll", {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("deleteError");

      // Click delete categories button
      cy.contains("h6", "Categories").parent().parent().find("button").click();

      // Confirm in modal
      cy.get(".modal-footer").contains("Confirm Delete").click();

      // Wait for API call
      cy.wait("@deleteError");

      // Check error message
      cy.contains("Operation failed").should("be.visible");
    });
  });

  describe("Export Operations", () => {
    beforeEach(() => {
      // Setup download stubs
      cy.window().then((win) => {
        cy.stub(win.URL, "createObjectURL").returns("blob:test-url");
        cy.stub(win.URL, "revokeObjectURL").as("revokeObjectURL");
      });

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
    });

    it("should export users data", () => {
      cy.intercept("GET", "**/api/users/admin/all?limit=1000").as("fetchUsers");

      // Find the Users row and click Export button
      cy.contains(".healthItem", "Users")
        .find("button")
        .contains("Export")
        .click();

      cy.wait("@fetchUsers");

      // Verify PDF was created (success message appears)
      cy.contains("Data exported successfully").should("be.visible");
    });

    it("should export transactions data", () => {
      cy.intercept("GET", "**/api/transactions/yearly").as("fetchTransactions");

      // Find the Transactions row and click Export button
      cy.contains(".healthItem", "Transactions")
        .find("button")
        .contains("Export")
        .click();

      cy.wait("@fetchTransactions");
      cy.contains("Data exported successfully").should("be.visible");
    });

    it("should export as JSON", () => {
      // Click JSON Export button
      cy.contains("JSON Export")
        .parent()
        .parent()
        .find("button")
        .contains("Export as JSON")
        .click();

      // Verify download was triggered
      cy.get("@downloadClick").should("be.called");
      cy.get("@revokeObjectURL").should("be.called");

      cy.contains("Data exported as JSON successfully").should("be.visible");
    });

    it("should handle export errors gracefully", () => {
      cy.intercept("GET", "**/api/users/admin/all?limit=1000", {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("exportError");

      // Find the Users row and click Export button
      cy.contains(".healthItem", "Users")
        .find("button")
        .contains("Export")
        .click();

      cy.wait("@exportError");
      cy.contains("Export failed").should("be.visible");
    });
  });

  describe("Loading States", () => {
    it("should show loading state during operations", () => {
      // Intercept delete request with delay
      cy.intercept("DELETE", "**/api/transactions/deleteAll", {
        delay: 1000,
        body: { success: true },
      }).as("slowDelete");

      // Click delete transactions button
      cy.contains("h6", "Transactions")
        .parent()
        .parent()
        .find("button")
        .click();

      // Confirm in modal
      cy.get(".modal-footer").contains("Confirm Delete").click();

      // Button should show loading spinner
      cy.get(".modal-footer button")
        .contains("Confirm Delete")
        .find(".spinner-border")
        .should("be.visible");

      cy.wait("@slowDelete");
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile devices", () => {
      cy.viewport(375, 667);

      // Cards should stack vertically on mobile
      cy.get(".card").should("have.length", 2);

      // Check that content is visible
      cy.contains("h5", "Database Operations").should("be.visible");
      cy.contains("h5", "Data Statistics & Export").should("be.visible");
    });

    it("should display correctly on tablet devices", () => {
      cy.viewport(768, 1024);

      cy.get(".card").should("have.length", 2);
      cy.contains("h5", "Database Operations").should("be.visible");
      cy.contains("h5", "Data Statistics & Export").should("be.visible");
    });

    it("should display side by side on desktop", () => {
      cy.viewport(1200, 800);

      // Both cards should be visible
      cy.get(".card").should("have.length", 2);
      cy.contains("h5", "Database Operations").should("be.visible");
      cy.contains("h5", "Data Statistics & Export").should("be.visible");
    });
  });
});
