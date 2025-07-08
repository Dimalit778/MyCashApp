describe("Admin User Management", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-admin");

    // Create test users with different roles
    cy.request({
      method: "POST",
      url: `${Cypress.env("API_URL")}/api/seed/users`,
      body: { count: 20 },
    });

    cy.loginTestUser("admin");
    cy.visit("/admin/users");
  });

  describe("Page Load and Display", () => {
    it("should display the user management page with correct elements", () => {
      // Page header
      cy.contains("h1", "User Management").should("be.visible");
      cy.contains("Manage user accounts, roles, and permissions").should(
        "be.visible"
      );

      // Main table should be visible
      cy.getDataCy("users-table").should("be.visible");

      // Table headers
      cy.contains("th", "User").should("be.visible");
      cy.contains("th", "Email").should("be.visible");
      cy.contains("th", "Role").should("be.visible");
      cy.contains("th", "Joined").should("be.visible");
      cy.contains("th", "Actions").should("be.visible");
    });

    it("should display user list with pagination", () => {
      // Should show users in table
      cy.getDataCy("user-row").should("have.length.greaterThan", 0);

      // Pagination should be visible
      cy.getDataCy("pagination").should("be.visible");
      cy.getDataCy("page-info").should("contain", "Page");
    });

    it("should display search and filter controls", () => {
      cy.getDataCy("search-users-input").should("be.visible");
      cy.getDataCy("role-filter-dropdown").should("be.visible");
    });
  });

  describe("User Search", () => {
    it("should search users by name", () => {
      // Get first user's name
      let firstName;
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-name").then(($name) => {
            firstName = $name.text().split(" ")[0];
          });
        });

      // Search for the user
      cy.getDataCy("search-users-input").type(firstName);

      // Should filter results
      cy.getDataCy("user-row").each(($row) => {
        cy.wrap($row).should("contain", firstName);
      });
    });

    it("should search users by email", () => {
      // Get first user's email
      let userEmail;
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-email").then(($email) => {
            userEmail = $email.text();
          });
        });

      // Search for the email
      cy.getDataCy("search-users-input").type(userEmail);

      // Should show only that user
      cy.getDataCy("user-row").should("have.length", 1);
      cy.getDataCy("user-row").first().should("contain", userEmail);
    });

    it("should show no results for invalid search", () => {
      cy.getDataCy("search-users-input").type("nonexistentuserxyz123");

      cy.getDataCy("no-results").should("be.visible");
      cy.contains("No users found").should("be.visible");
    });

    it("should clear search results", () => {
      // Search for something
      cy.getDataCy("search-users-input").type("test");

      // Clear search
      cy.getDataCy("clear-search-btn").click();

      // Should show all users again
      cy.getDataCy("search-users-input").should("have.value", "");
      cy.getDataCy("user-row").should("have.length.greaterThan", 0);
    });
  });

  describe("Role Filtering", () => {
    beforeEach(() => {
      // Create an admin user for testing
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/auth/signup`,
        body: {
          firstName: "Test",
          lastName: "Admin",
          email: "testadmin@gmail.com",
          password: "password123",
        },
      }).then((response) => {
        const userId = response.body.data.user._id;

        // Update role to admin
        cy.request({
          method: "PATCH",
          url: `${Cypress.env("API_URL")}/api/users/admin/user/${userId}/role`,
          headers: {
            Cookie: `token=${Cypress.env("adminToken")}`,
          },
          body: { role: "admin" },
        });
      });
    });

    it("should filter users by admin role", () => {
      cy.getDataCy("role-filter-dropdown").click();
      cy.getDataCy("filter-admin").click();

      // All displayed users should be admins
      cy.getDataCy("user-row").each(($row) => {
        cy.wrap($row).within(() => {
          cy.getDataCy("user-role").should("contain", "admin");
        });
      });
    });

    it("should filter users by user role", () => {
      cy.getDataCy("role-filter-dropdown").click();
      cy.getDataCy("filter-user").click();

      // All displayed users should have user role
      cy.getDataCy("user-row").each(($row) => {
        cy.wrap($row).within(() => {
          cy.getDataCy("user-role").should("contain", "user");
        });
      });
    });

    it("should show all users when filter is cleared", () => {
      // Apply filter first
      cy.getDataCy("role-filter-dropdown").click();
      cy.getDataCy("filter-admin").click();

      // Clear filter
      cy.getDataCy("role-filter-dropdown").click();
      cy.getDataCy("filter-all").click();

      // Should show both admin and user roles
      cy.getDataCy("user-row").should("have.length.greaterThan", 0);
    });
  });

  describe("Role Management", () => {
    it("should change user role from user to admin", () => {
      // Find a user with "user" role
      cy.getDataCy("user-row").then(($rows) => {
        const userRow = Array.from($rows).find((row) =>
          row
            .querySelector('[data-cy="user-role"]')
            ?.textContent.includes("user")
        );

        if (userRow) {
          cy.wrap(userRow).within(() => {
            // Click role dropdown
            cy.getDataCy("role-dropdown").click();

            // Select "Make Admin"
            cy.getDataCy("make-admin").click();
          });

          // Confirm role change
          cy.on("window:confirm", () => true);

          // Check success message
          cy.contains("User role updated successfully").should("be.visible");

          // Verify role changed
          cy.wrap(userRow).within(() => {
            cy.getDataCy("user-role").should("contain", "admin");
          });
        }
      });
    });

    it("should change user role from admin to user", () => {
      // First create an admin user
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/seed/admin`,
        body: { email: "demote@gmail.com" },
      });

      cy.reload();

      // Find the admin user
      cy.getDataCy("search-users-input").type("demote@gmail.com");

      cy.getDataCy("user-row")
        .first()
        .within(() => {
          // Click role dropdown
          cy.getDataCy("role-dropdown").click();

          // Select "Make User"
          cy.getDataCy("make-user").click();
        });

      // Check success message
      cy.contains("User role updated successfully").should("be.visible");

      // Verify role changed
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-role").should("contain", "user");
        });
    });

    it("should not allow changing own role", () => {
      // Search for current admin user
      cy.getDataCy("search-users-input").type(Cypress.env("TEST_ADMIN_EMAIL"));

      cy.getDataCy("user-row")
        .first()
        .within(() => {
          // Role dropdown should be disabled
          cy.getDataCy("role-dropdown").should("be.disabled");
        });
    });
  });

  describe("User Actions", () => {
    it("should navigate to user details page", () => {
      // Click on first user's view button
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-email").then(($email) => {
            const email = $email.text();

            cy.getDataCy("view-user-btn").click();

            // Should navigate to user details
            cy.url().should("match", /\/admin\/users\/[a-f0-9]{24}$/);
            cy.contains("User Details").should("be.visible");
            cy.contains(email).should("be.visible");
          });
        });
    });

    it("should delete a user with confirmation", () => {
      // Get initial user count
      let initialCount;
      cy.getDataCy("user-row").then(($rows) => {
        initialCount = $rows.length;
      });

      // Delete first user
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-email").then(($email) => {
            const email = $email.text();

            cy.getDataCy("delete-user-btn").click();

            // Confirm deletion
            cy.on("window:confirm", (str) => {
              expect(str).to.contain(`delete user "${email}"`);
              return true;
            });
          });
        });

      // Check success message
      cy.contains("User deleted successfully").should("be.visible");

      // Verify count decreased
      cy.getDataCy("user-row").should("have.length", initialCount - 1);
    });

    it("should cancel user deletion", () => {
      // Get initial count
      let initialCount;
      cy.getDataCy("user-row").then(($rows) => {
        initialCount = $rows.length;
      });

      // Try to delete but cancel
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-user-btn").click();

          // Cancel confirmation
          cy.on("window:confirm", () => false);
        });

      // Count should remain the same
      cy.getDataCy("user-row").should("have.length", initialCount);
    });

    it("should not allow deleting own account", () => {
      // Search for current admin
      cy.getDataCy("search-users-input").type(Cypress.env("TEST_ADMIN_EMAIL"));

      cy.getDataCy("user-row")
        .first()
        .within(() => {
          // Delete button should be disabled
          cy.getDataCy("delete-user-btn").should("be.disabled");
        });
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      // Ensure we have enough users for pagination
      cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/seed/users`,
        body: { count: 30 },
      });
      cy.reload();
    });

    it("should navigate through pages", () => {
      // Should start on page 1
      cy.getDataCy("current-page").should("contain", "1");

      // Go to next page
      cy.getDataCy("next-page-btn").click();
      cy.getDataCy("current-page").should("contain", "2");

      // Go to previous page
      cy.getDataCy("prev-page-btn").click();
      cy.getDataCy("current-page").should("contain", "1");
    });

    it("should disable navigation buttons appropriately", () => {
      // On first page, previous should be disabled
      cy.getDataCy("prev-page-btn").should("be.disabled");

      // Go to last page
      cy.getDataCy("last-page-btn").click();

      // Next should be disabled
      cy.getDataCy("next-page-btn").should("be.disabled");
    });

    it("should jump to specific page", () => {
      // Click page 2
      cy.getDataCy("page-2-btn").click();

      cy.getDataCy("current-page").should("contain", "2");
      cy.url().should("include", "page=2");
    });

    it("should maintain filters across pagination", () => {
      // Apply search filter
      cy.getDataCy("search-users-input").type("test");

      // If pagination exists, navigate
      cy.getDataCy("next-page-btn").then(($btn) => {
        if (!$btn.is(":disabled")) {
          cy.wrap($btn).click();

          // Search should still be applied
          cy.getDataCy("search-users-input").should("have.value", "test");
        }
      });
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile", () => {
      cy.viewport(375, 667);

      // Table should be scrollable
      cy.getDataCy("users-table-container").should("be.visible");

      // Search should be visible
      cy.getDataCy("search-users-input").should("be.visible");

      // Actions should be accessible
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("actions-menu").should("be.visible");
        });
    });

    it("should display correctly on tablet", () => {
      cy.viewport(768, 1024);

      cy.getDataCy("users-table").should("be.visible");
      cy.getDataCy("search-users-input").should("be.visible");
      cy.getDataCy("role-filter-dropdown").should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors when loading users", () => {
      cy.intercept("GET", "**/api/users/admin/all**", {
        statusCode: 500,
        body: { message: "Server error" },
      }).as("getUsersError");

      cy.reload();
      cy.wait("@getUsersError");

      cy.contains("Failed to load users").should("be.visible");
    });

    it("should handle errors when updating role", () => {
      cy.intercept("PATCH", "**/api/users/admin/user/*/role", {
        statusCode: 403,
        body: { message: "Insufficient permissions" },
      }).as("updateRoleError");

      // Try to change a role
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("role-dropdown").click();
          cy.getDataCy("make-admin").click();
        });

      cy.wait("@updateRoleError");
      cy.contains("Failed to update user role").should("be.visible");
    });

    it("should handle errors when deleting user", () => {
      cy.intercept("DELETE", "**/api/users/admin/user/*", {
        statusCode: 500,
        body: { message: "Database error" },
      }).as("deleteUserError");

      // Try to delete a user
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-user-btn").click();
        });

      cy.on("window:confirm", () => true);

      cy.wait("@deleteUserError");
      cy.contains("Failed to delete user").should("be.visible");
    });
  });

  describe("Real-time Updates", () => {
    it("should refresh data after role change", () => {
      // Change a user's role
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("role-dropdown").click();
          cy.getDataCy("make-admin").click();
        });

      // Data should be refreshed
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("user-role").should("contain", "admin");
        });
    });

    it("should update user count after deletion", () => {
      // Note the page info
      let initialPageInfo;
      cy.getDataCy("page-info").then(($info) => {
        initialPageInfo = $info.text();
      });

      // Delete a user
      cy.getDataCy("user-row")
        .first()
        .within(() => {
          cy.getDataCy("delete-user-btn").click();
        });
      cy.on("window:confirm", () => true);

      // Page info should update
      cy.getDataCy("page-info").should(($info) => {
        expect($info.text()).not.to.equal(initialPageInfo);
      });
    });
  });
});
