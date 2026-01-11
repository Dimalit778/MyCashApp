const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  retries: {
    runMode: 2,
  },
  env: {
    API_URL: process.env.REACT_APP_API_URL,
    mobileViewportWidthBreakpoint: 414,
    TEST_EMAIL: process.env.REACT_APP_TEST_EMAIL,
    TEST_PASSWORD: process.env.REACT_APP_TEST_PASSWORD,
    TEST_ADMIN_EMAIL: process.env.REACT_APP_TEST_ADMIN_EMAIL,
    TEST_ADMIN_PASSWORD: process.env.REACT_APP_TEST_ADMIN_PASSWORD,
    protectedRoutes: [
      "/home",
      "/transactions/expenses",
      "/transactions/incomes",
      "/settings",
      "/contact",
    ],
    adminRoutes: [
      "",
      "/admin/analytics",
      "/admin/users",
      "/admin/categories",
      "/admin/database",
    ],
  },
  e2e: {
    watchForFileChanges: false,
    baseUrl: process.env.REACT_APP_BASE_URL,
    viewportHeight: 1000,
    viewportWidth: 1280,

    setupNodeEvents(on, config) {
      // Disable certificate errors
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' || browser.name === 'electron') {
          launchOptions.args.push('--disable-features=CertificateTransparencyComponentUpdater');
          launchOptions.args.push('--ignore-certificate-errors');
          launchOptions.args.push('--disable-web-security');
        }
        return launchOptions;
      });

      on("task", {
        async "db:seed-admin"() {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/seed/admin`, {
              method: "POST",
            });
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },
        async "db:seed-user"() {
          try {
            await fetch(
              `${process.env.REACT_APP_API_URL}/seed/userAndCategories`,
              {
                method: "POST",
              }
            );
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },

        async "db:seed-transactions"({ count, type, monthly }) {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/seed/transactions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ count, type, monthly }),
            });
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },
        async "db:multiple-users"() {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/seed/multipleUsers`, {
              method: "POST",
            });
            return null;
          } catch (error) {
            console.error("Seed error:", error);
            return null;
          }
        },

        async "db:clear-db"() {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/seed/clear`, {
              method: "DELETE",
            });
            return null;
          } catch (error) {
            console.error("Clear error:", error);
            return null;
          }
        },
      });
    },
  },
});
