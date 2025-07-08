describe("Admin User Details Page", () => {
  let testUserId;

  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");

    // Create a test user with transactions and categories
    cy.request({
      method: "POST",
      url: `${Cypress.env("API_URL")}/api/auth/signup`,
      body: {
        firstName: "Test",
        lastName: "User",
        email: "testuser@gmail.com",
        password: "password123",
      },
    }).then((response) => {
      testUserId = response.body.data.user._id;

      // Add some transactions and categories for the test user
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/seed/userdata`,
        body: {
          userId: testUserId,
          transactions: 30,
          categories: 5,
        },
      });
    });

    cy.loginTestUser("admin");
  });

  describe("Page Navigation and Display", () => {
    it("should navigate to user details page from users list", () => {
      cy.visit("/admin/users");

      // Search for test user
      cy.getDataCy("search-users-input").type("testuser@gmail.com");

      // Click view button
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("view-user-btn").click();
        });

      // Should be on user details page
      cy.url().should("include", `/admin/users/${testUserId}`);
      cy.contains("h1", "User Details").should("be.visible");
    });

    it("should display user profile information", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // User info should be displayed
      cy.contains("Test User").should("be.visible");
      cy.contains("testuser@gmail.com").should("be.visible");
      cy.getDataCy("user-role-badge").should("contain", "user");
      cy.getDataCy("user-joined-date").should("be.visible");
      cy.getDataCy("user-avatar").should("be.visible");
    });

    it("should display user statistics", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Statistics should be visible
      cy.getDataCy("total-transactions").should("be.visible");
      cy.getDataCy("total-categories").should("be.visible");
      cy.contains("Total Transactions").should("be.visible");
      cy.contains("Total Categories").should("be.visible");
    });

    it("should have back button to return to users list", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Click back button
      cy.getDataCy("back-button").click();

      // Should return to users list
      cy.url().should("include", "/admin/users");
      cy.contains("User Management").should("be.visible");
    });
  });

  describe("User Categories Section", () => {
    it("should display user categories table", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Categories section should be visible
      cy.getDataCy("user-categories-section").should("be.visible");
      cy.contains("User Categories").should("be.visible");

      // Table headers
      cy.contains("th", "Name").should("be.visible");
      cy.contains("th", "Type").should("be.visible");
      cy.contains("th", "Created").should("be.visible");
    });

    it("should list all user categories", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Should have categories
      cy.getDataCy("category-row").should("have.length.greaterThan", 0);

      // Each category should show type badge
      cy.getDataCy("category-row").each(($row) => {
        cy.wrap($row).within(() => {
          cy.getDataCy("category-name").should("be.visible");
          cy.getDataCy("category-type-badge").should("be.visible");
          cy.getDataCy("category-date").should("be.visible");
        });
      });
    });

    it("should handle empty categories gracefully", () => {
      // Create user without categories
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/auth/signup`,
        body: {
          firstName: "No",
          lastName: "Categories",
          email: "nocategories@gmail.com",
          password: "password123",
        },
      }).then((response) => {
        const userId = response.body.data.user._id;
        cy.visit(`/admin/users/${userId}`);

        cy.contains("No categories found").should("be.visible");
      });
    });
  });

  describe("User Transactions Section", () => {
    it("should display transactions with tabs", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Transaction tabs should be visible
      cy.getDataCy("expenses-tab").should("be.visible");
      cy.getDataCy("income-tab").should("be.visible");

      // Default to expenses tab
      cy.getDataCy("expenses-tab").should("have.class", "active");
    });

    it("should switch between expense and income transactions", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // View expenses
      cy.getDataCy("expenses-tab").click();
      cy.contains("Expense Transactions").should("be.visible");

      // View income
      cy.getDataCy("income-tab").click();
      cy.contains("Income Transactions").should("be.visible");
    });

    it("should display transaction table with correct columns", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Table headers
      cy.contains("th", "Date").should("be.visible");
      cy.contains("th", "Description").should("be.visible");
      cy.contains("th", "Category").should("be.visible");
      cy.contains("th", "Amount").should("be.visible");
      cy.contains("th", "Actions").should("be.visible");
    });

    it("should display transaction total", () => {
      cy.visit(`/admin/users/${testUserId}`);

      cy.getDataCy("transactions-total").should("be.visible");
      cy.getDataCy("transactions-total").should("contain", "Total: $");
    });

    it("should filter transactions by month and year", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Select a specific month
      cy.getDataCy("month-filter").select("1"); // January
      cy.getDataCy("year-filter").select(new Date().getFullYear().toString());

      // Transactions should be filtered
      cy.getDataCy("transaction-row").each(($row) => {
        cy.wrap($row).within(() => {
          cy.getDataCy("transaction-date").should("contain", "Jan");
        });
      });
    });

    it("should clear filters to show all transactions", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Apply filters first
      cy.getDataCy("month-filter").select("1");

      // Clear filters
      cy.getDataCy("month-filter").select("");

      // Should show all transactions
      cy.getDataCy("transaction-row").should("have.length.greaterThan", 0);
    });
  });

  describe("Transaction Management", () => {
    it("should edit a transaction", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Click edit on first transaction
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("edit-transaction-btn").click();
        });

      // Edit modal should open
      cy.getDataCy("edit-transaction-modal").should("be.visible");

      // Update transaction details
      cy.getDataCy("edit-description-input")
        .clear()
        .type("Updated Description");
      cy.getDataCy("edit-amount-input").clear().type("150.50");
      cy.getDataCy("save-transaction-btn").click();

      // Check success message
      cy.contains("Transaction updated successfully").should("be.visible");

      // Verify update
      cy.getDataCy("transaction-row")
        .first()
        .should("contain", "Updated Description");
      cy.getDataCy("transaction-row").first().should("contain", "$150.50");
    });

    it("should cancel edit without saving", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Get original description
      let originalDesc;
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("transaction-description").then(($desc) => {
            originalDesc = $desc.text();
          });
          cy.getDataCy("edit-transaction-btn").click();
        });

      // Change but cancel
      cy.getDataCy("edit-description-input").clear().type("Should Not Save");
      cy.getDataCy("cancel-edit-btn").click();

      // Modal should close
      cy.getDataCy("edit-transaction-modal").should("not.exist");

      // Original description should remain
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("transaction-description").should(
            "have.text",
            originalDesc
          );
        });
    });

    it("should delete a transaction", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Get initial count
      let initialCount;
      cy.getDataCy("transaction-row").then(($rows) => {
        initialCount = $rows.length;
      });

      // Delete first transaction
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-transaction-btn").click();
        });

      // Confirm deletion
      cy.on("window:confirm", (str) => {
        expect(str).to.contain("delete this transaction");
        return true;
      });

      // Check success message
      cy.contains("Transaction deleted successfully").should("be.visible");

      // Verify count decreased
      cy.getDataCy("transaction-row").should("have.length", initialCount - 1);
    });

    it("should cancel transaction deletion", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Get initial count
      let initialCount;
      cy.getDataCy("transaction-row").then(($rows) => {
        initialCount = $rows.length;
      });

      // Try to delete but cancel
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-transaction-btn").click();
        });

      cy.on("window:confirm", () => false);

      // Count should remain the same
      cy.getDataCy("transaction-row").should("have.length", initialCount);
    });
  });

  describe("Data Validation", () => {
    it("should validate transaction amount on edit", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Open edit modal
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("edit-transaction-btn").click();
        });

      // Try invalid amount
      cy.getDataCy("edit-amount-input").clear().type("abc");
      cy.getDataCy("save-transaction-btn").click();

      cy.contains("Invalid amount").should("be.visible");

      // Try negative amount
      cy.getDataCy("edit-amount-input").clear().type("-50");
      cy.getDataCy("save-transaction-btn").click();

      cy.contains("Amount must be positive").should("be.visible");
    });

    it("should validate required fields on edit", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Open edit modal
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("edit-transaction-btn").click();
        });

      // Clear description
      cy.getDataCy("edit-description-input").clear();
      cy.getDataCy("save-transaction-btn").click();

      cy.contains("Description is required").should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid user ID", () => {
      cy.visit("/admin/users/invaliduserid123", { failOnStatusCode: false });

      cy.contains("User not found").should("be.visible");
    });

    it("should handle API errors when loading user details", () => {
      cy.intercept("GET", `**/api/users/admin/user/${testUserId}`, {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("getUserError");

      cy.visit(`/admin/users/${testUserId}`);
      cy.wait("@getUserError");

      cy.contains("Failed to load user details").should("be.visible");
    });

    it("should handle errors when updating transaction", () => {
      cy.intercept("PATCH", "**/api/transactions/*", {
        statusCode: 500,
        body: { message: "Update failed" },
      }).as("updateError");

      cy.visit(`/admin/users/${testUserId}`);

      // Try to edit
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("edit-transaction-btn").click();
        });

      cy.getDataCy("save-transaction-btn").click();
      cy.wait("@updateError");

      cy.contains("Failed to update transaction").should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile", () => {
      cy.viewport(375, 667);
      cy.visit(`/admin/users/${testUserId}`);

      // Profile and categories should stack
      cy.getDataCy("user-profile-card").should("be.visible");
      cy.getDataCy("user-categories-section").should("be.visible");

      // Transaction filters should be accessible
      cy.getDataCy("month-filter").should("be.visible");
      cy.getDataCy("year-filter").should("be.visible");
    });

    it("should display correctly on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit(`/admin/users/${testUserId}`);

      cy.getDataCy("user-profile-card").should("be.visible");
      cy.getDataCy("user-categories-section").should("be.visible");
      cy.getDataCy("transactions-section").should("be.visible");
    });

    it("should handle horizontal scroll for transaction table on mobile", () => {
      cy.viewport(375, 667);
      cy.visit(`/admin/users/${testUserId}`);

      // Transaction table should be scrollable
      cy.getDataCy("transactions-table-container").should(
        "have.css",
        "overflow-x",
        "auto"
      );
    });
  });

  describe("Data Refresh", () => {
    it("should update totals after transaction deletion", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Note initial total
      let initialTotal;
      cy.getDataCy("transactions-total").then(($total) => {
        initialTotal = $total.text();
      });

      // Delete a transaction
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-transaction-btn").click();
        });
      cy.on("window:confirm", () => true);

      // Total should update
      cy.getDataCy("transactions-total").should(($total) => {
        expect($total.text()).not.to.equal(initialTotal);
      });
    });

    it("should update transaction count in profile after deletion", () => {
      cy.visit(`/admin/users/${testUserId}`);

      // Note initial count
      let initialCount;
      cy.getDataCy("total-transactions").then(($count) => {
        initialCount = parseInt($count.text());
      });

      // Delete a transaction
      cy.getDataCy("transaction-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-transaction-btn").click();
        });
      cy.on("window:confirm", () => true);

      // Count should decrease
      cy.getDataCy("total-transactions").should("contain", initialCount - 1);
    });
  });
});
