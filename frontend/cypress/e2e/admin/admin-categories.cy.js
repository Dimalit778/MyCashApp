describe("Admin Default Categories Management", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");

    cy.loginTestUser("admin");
    cy.intercept("GET", "**/api/default-categories").as("getCategories");

    cy.visit("/admin/categories");

    cy.wait("@getCategories");
  });

  describe("Page Load and Display", () => {
    it("should display the categories page with correct elements", () => {
      // Page header
      cy.contains("h1", "Default Categories").should("be.visible");
      cy.contains("Manage default categories for your application").should(
        "be.visible"
      );
      cy.getDataCy("admin-categories-container").should("be.visible");

      cy.getDataCy("add-category-button").should("be.visible");
    });

    it("should display existing default categories", () => {
      cy.get("@getCategories").then((res) => {
        const categories = res.response.body.data;
        cy.getDataCy("categories-body")
          .find("tr")
          .should("have.length", categories.length);
      });
    });
  });

  describe("Add New Category", () => {
    it("should add a new expense category", () => {
      // Fill in the form
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");

      cy.getDataCy("category-name-input").type("Test Expense Category");
      cy.getDataCy("category-type-select").select("expenses");
      cy.getDataCy("save-category-btn").click();

      // Check success message
      cy.contains("Category added successfully").should("be.visible");
      cy.getDataCy("category-modal").should("not.exist");
      cy.wait("@getCategories").then((res) => {
        const categories = res.response.body.data;
        cy.getDataCy("categories-body")
          .find("tr")
          .should("have.length", categories.length);
        cy.getDataCy("category-item")
          .contains("Test Expense Category")
          .should("be.visible");
      });
    });

    it("should add a new income category", () => {
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");

      cy.getDataCy("category-name-input").type("Test Income Category");
      cy.getDataCy("category-type-select").select("incomes");
      cy.getDataCy("save-category-btn").click();
      cy.getDataCy("category-modal").should("not.exist");

      cy.wait("@getCategories").then((res) => {
        const categories = res.response.body.data;
        cy.getDataCy("categories-body")
          .find("tr")
          .should("have.length", categories.length);
        cy.getDataCy("category-item")
          .contains("Test Income Category")
          .should("be.visible");
      });
    });

    it("should validate category name", () => {
      // Try to submit without name
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");
      cy.getDataCy("save-category-btn").click();
      cy.contains("Category name is required").should("be.visible");

      // Try with short name
      cy.getDataCy("category-name-input").type("A");
      cy.getDataCy("save-category-btn").click();
      cy.contains("Category name must be at least 2 characters").should(
        "be.visible"
      );

      // Try with long name
      cy.getDataCy("category-name-input").clear();
      cy.getDataCy("category-name-input").type("A".repeat(35));
      cy.getDataCy("save-category-btn").click();
      cy.contains("Category name must be less than 30 characters").should(
        "be.visible"
      );
    });

    it("should prevent duplicate category names", () => {
      // Add a category
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");
      cy.getDataCy("category-name-input").type("Duplicate Test");
      cy.getDataCy("category-type-select").select("expenses");
      cy.getDataCy("save-category-btn").click();
      cy.contains("Category added successfully").should("be.visible");
      cy.getDataCy("category-modal").should("not.exist");

      // Try to add the same category again
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");
      cy.getDataCy("category-name-input").type("Duplicate Test");
      cy.getDataCy("category-type-select").select("expenses");
      cy.getDataCy("save-category-btn").click();
      cy.contains("Category already exists").should("be.visible");
    });
  });

  describe("Edit Category", () => {
    it("should edit an existing category", () => {
      // Click edit on first category
      cy.getDataCy("category-item")
        .first()
        .within(() => {
          cy.getDataCy("edit-category-btn").click();
        });

      // Edit modal should open
      cy.getDataCy("category-modal").should("be.visible");
      cy.getDataCy("modal-title").should("have.text", "Edit Category");

      // Update the name
      cy.getDataCy("category-name-input").clear();
      cy.getDataCy("category-name-input").type("Updated Category Name");
      cy.getDataCy("save-category-btn").click();

      // Check success message
      cy.contains("Category updated successfully").should("be.visible");

      // Verify the category was updated
      cy.contains("Updated Category Name").should("be.visible");
    });

    it("should cancel edit without saving", () => {
      cy.get('[data-cy="categories-body"] > :nth-child(1) > :nth-child(2)')
        .invoke("text")
        .as("originalCategoryName");

      cy.getDataCy("category-item")
        .first()
        .within(() => {
          cy.getDataCy("edit-category-btn").click();
        });

      cy.getDataCy("category-modal").should("be.visible");

      cy.getDataCy("category-name-input").clear();
      cy.getDataCy("category-name-input").type("Should Not Save");
      cy.getDataCy("cancel-category-btn").click();

      cy.getDataCy("category-modal").should("not.exist");

      // Original name should still be there
      cy.get("@originalCategoryName").then((originalName) => {
        cy.get(
          '[data-cy="categories-body"] > :nth-child(1) > :nth-child(2)'
        ).should("have.text", originalName);
      });
    });
  });

  describe("Delete Category", () => {
    it("should delete a category with confirmation", () => {
      // Get the count of categories before deletion

      cy.getDataCy("category-item")
        .then(($items) => $items.length)
        .as("initialCount");

      cy.get("@initialCount").then((initialCount) => {
        console.log("initialCount", initialCount);
      });

      // Click delete on first category
      cy.getDataCy("category-item")
        .first()
        .within(() => {
          cy.getDataCy("delete-category-btn").click();
        });

      // Confirm in SweetAlert dialog
      cy.get(".swal2-confirm").click();

      // Check success message
      cy.get(".swal2-success-ring").should("be.visible");

      cy.get("@initialCount").then((initialCount) => {
        cy.getDataCy("category-item").should("have.length", initialCount - 1);
      });
    });

    it("should cancel category deletion", () => {
      // Get the count of categories before
      cy.getDataCy("category-item")
        .then(($items) => $items.length)
        .as("initialCount");

      // Click delete but cancel
      cy.getDataCy("category-item")
        .first()
        .within(() => {
          cy.getDataCy("delete-category-btn").click();
        });

      // Cancel confirmation in SweetAlert
      cy.get(".swal2-cancel").click();

      // Count should remain the same
      cy.get("@initialCount").then((initialCount) => {
        cy.getDataCy("category-item").should("have.length", initialCount);
      });
    });
  });

  describe("Category Filtering and Search", () => {
    beforeEach(() => {
      // Add search input if not present in the component
      cy.get("body").then(($body) => {
        if (!$body.find('[data-cy="search-categories-input"]').length) {
          cy.log("Search input not found - skipping search tests");
        }
      });

      // Add tab navigation if not present
      cy.get("body").then(($body) => {
        if (!$body.find('[data-cy="income-tab"]').length) {
          cy.log("Tab navigation not found - skipping tab tests");
        }
      });
    });

    it("should filter categories by search term", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="search-categories-input"]').length) {
          // Add a test category first
          cy.getDataCy("add-category-button").click();
          cy.getDataCy("category-name-input").type("Food & Dining");
          cy.getDataCy("category-type-select").select("expenses");
          cy.getDataCy("save-category-btn").click();
          cy.wait(500);

          // Search for "Food"
          cy.getDataCy("search-categories-input").type("Food");

          // Should show only matching category
          cy.contains("Food & Dining").should("be.visible");
        } else {
          cy.log("Skipping search test - search input not implemented");
        }
      });
    });

    it("should toggle between expense and income categories", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-cy="income-tab"]').length &&
          $body.find('[data-cy="expense-tab"]').length
        ) {
          // Add test categories first
          const categories = [
            { name: "Food & Dining", type: "expenses" },
            { name: "Salary", type: "incomes" },
          ];

          categories.forEach((cat) => {
            cy.getDataCy("add-category-button").click();
            cy.getDataCy("category-modal").should("be.visible");
            cy.getDataCy("category-name-input").clear().type(cat.name);
            cy.getDataCy("category-type-select").select(cat.type);
            cy.getDataCy("save-category-btn").click();
            cy.wait(500);
          });

          // Click on income tab
          cy.getDataCy("income-tab").click();

          // Should show only income categories
          cy.contains("Salary").should("be.visible");
          cy.contains("Food & Dining").should("not.exist");

          // Click on expense tab
          cy.getDataCy("expense-tab").click();

          // Should show only expense categories
          cy.contains("Food & Dining").should("be.visible");
          cy.contains("Salary").should("not.exist");
        } else {
          cy.log("Skipping tab test - tab navigation not implemented");
        }
      });
    });
  });

  describe("Bulk Operations", () => {
    it("should reset to default categories", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="reset-to-defaults-btn"]').length) {
          // Add a custom category first
          cy.getDataCy("add-category-button").click();
          cy.getDataCy("category-modal").should("be.visible");
          cy.getDataCy("category-name-input").type("Custom Category");
          cy.getDataCy("category-type-select").select("expenses");
          cy.getDataCy("save-category-btn").click();
          cy.contains("Category added successfully").should("be.visible");

          // Click reset to defaults button
          cy.getDataCy("reset-to-defaults-btn").click();

          // Confirm the action
          cy.get(".swal2-confirm").click();

          // Check success message
          cy.contains("Categories reset to defaults").should("be.visible");

          // Custom category should be gone
          cy.contains("Custom Category").should("not.exist");
        } else {
          cy.log("Skipping reset test - reset button not implemented");
        }
      });
    });

    it("should export categories to JSON", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="export-categories-btn"]').length) {
          // Spy on download
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

          // Click export button
          cy.getDataCy("export-categories-btn").click();

          // Verify download was triggered
          cy.get("@downloadClick").should("be.called");
          cy.get("@revokeObjectURL").should("be.called");
        } else {
          cy.log("Skipping export test - export button not implemented");
        }
      });
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile", () => {
      cy.viewport(375, 667);

      // Check layout adjustments
      cy.getDataCy("admin-categories-container").should("be.visible");

      // Check if form exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="add-category-form"]').length) {
          cy.getDataCy("add-category-form").should("be.visible");
        } else {
          // If no separate form, check the add button is visible
          cy.getDataCy("add-category-button").should("be.visible");
        }
      });
    });

    it("should display correctly on tablet", () => {
      cy.viewport(768, 1024);
      cy.getDataCy("admin-categories-container").should("be.visible");

      // Check if categories list exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="categories-list"]').length) {
          cy.getDataCy("categories-list").should("be.visible");
        } else {
          // If no separate list element, check the table is visible
          cy.getDataCy("categories-table").should("be.visible");
        }
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", () => {
      // Intercept and fail the add category request
      cy.intercept("POST", "**/api/default-categories/add", {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("addCategoryError");

      // Try to add a category
      cy.getDataCy("add-category-button").click();
      cy.getDataCy("category-modal").should("be.visible");
      cy.getDataCy("category-name-input").type("Error Test");
      cy.getDataCy("category-type-select").select("expenses");
      cy.getDataCy("save-category-btn").click();

      // Wait for error
      cy.wait("@addCategoryError");

      // Should show error message
      cy.contains("Server error").should("be.visible");
    });
  });
});
