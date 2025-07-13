import { isMobile } from "../../support/utils";

describe("User Sign-up and Login", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/auth/login").as("login");
    cy.intercept("POST", "**/api/auth/signup").as("signup");
    cy.visit("/");
  });

  it("should redirect unauthenticated user to Login page", () => {
    cy.visit("/home");
    cy.location("pathname").should("equal", "/");
  });
  it("should redirect to the home page after login", () => {
    cy.loginTestUser();
    cy.visit("/");
    cy.url().should("include", "/home");
  });
  it('should switch between "Login" and "Sign-up" forms', () => {
    cy.getDataCy("signup-link").should("be.visible").click();
    cy.url().should("include", "/signup");
    cy.getDataCy("login-link").should("be.visible").click();
    cy.url().should("include", "/login");
    cy.getDataCy("signup-link").should("be.visible").click();
    cy.url().should("include", "/signup");
  });
  it("should allow a visitor to sign-up, login, and logout", () => {
    cy.visit("/");
    cy.getDataCy("signup-link").click();
    cy.url().should("include", "/signup");
    cy.getDataCy("signup-firstName").find("input").type("John");
    cy.getDataCy("signup-lastName").find("input").type("Doe");
    cy.getDataCy("signup-email").find("input").type("johnDoe@gmail.com");
    cy.getDataCy("signup-password").find("input").type("password123");
    cy.getDataCy("signup-confirm-password").find("input").type("password123");
    cy.getDataCy("signup-submit").click();

    cy.url().should("include", "/login");

    cy.getDataCy("login-email").find("input").type("johnDoe@gmail.com");
    cy.getDataCy("login-password").find("input").type("password123");
    cy.getDataCy("login-submit").click();
    cy.url().should("include", "/home");

    if (isMobile()) {
      cy.getDataCy("top-bar").within(() => {
        cy.getDataCy("top-bar-logout-button").click();
      });
    } else {
      cy.getDataCy("left-sidebar").within(() => {
        cy.getDataCy("left-sidebar-logout-button").click();
      });
    }
    cy.url().should("include", "/");
  });
  it("should display forms elements  and toggle password visibility", () => {
    // ---------- LOGIN
    cy.visit("/login");
    cy.location("pathname").should("equal", "/login");
    // Form inputs
    cy.getDataCy("login-title").should("contain", "LOGIN");
    cy.getDataCy("login-email").should("be.visible");
    cy.getDataCy("login-password").should("be.visible");
    cy.getDataCy("login-submit").should("be.visible");
    cy.getDataCy("login-google").should("be.visible");
    // Password visibility
    cy.getDataCy("login-password")
      .find("input")
      .should("have.attr", "type", "password");
    cy.getDataCy("login-password").find("button").click();
    cy.getDataCy("login-password")
      .find("input")
      .should("have.attr", "type", "text");
    cy.getDataCy("login-password").find("button").click();
    cy.getDataCy("login-password")
      .find("input")
      .should("have.attr", "type", "password");
    //Form buttons
    cy.getDataCy("forgot-password").should("contain", "Forgot Password?");
    cy.getDataCy("signup-link").should("be.visible");
    cy.getDataCy("goto-signup").should("be.visible");
    // ---------- SIGNUP
    cy.visit("/signup");
    cy.location("pathname").should("equal", "/signup");
    // Form inputs
    cy.getDataCy("signup-title").should("be.visible").and("contain", "SIGN UP");
    cy.getDataCy("signup-firstName").should("be.visible");
    cy.getDataCy("signup-lastName").should("be.visible");
    cy.getDataCy("signup-email").should("be.visible");
    cy.getDataCy("signup-password").should("be.visible");
    cy.getDataCy("signup-confirm-password").should("be.visible");
    // Form buttons
    cy.getDataCy("signup-submit").should("be.visible");
    cy.getDataCy("signup-google").should("be.visible");
    cy.getDataCy("goto-login").should("be.visible");
    // Password visibility
    cy.getDataCy("signup-password")
      .find("input")
      .should("have.attr", "type", "password");
    cy.getDataCy("signup-password").find("button").click();
    cy.getDataCy("signup-password")
      .find("input")
      .should("have.attr", "type", "text");
    cy.getDataCy("signup-confirm-password")
      .find("input")
      .should("have.attr", "type", "password");
    cy.getDataCy("signup-confirm-password").find("button").click();
    cy.getDataCy("signup-confirm-password")
      .find("input")
      .should("have.attr", "type", "text");
  });

  it("should display login errors", () => {
    cy.visit("/login");
    cy.location("pathname").should("equal", "/login");
    cy.getDataCy("login-submit").click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");

    cy.getDataCy("login-email").find("input").type("invalidemail");
    cy.getDataCy("login-submit").click();
    cy.contains("Invalid email address").should("be.visible");
  });

  it("should display signup errors", () => {
    cy.visit("/signup");
    cy.location("pathname").should("equal", "/signup");
    cy.getDataCy("signup-submit").click();
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("Confirm password is required").should("be.visible");
    // length errors
    cy.getDataCy("signup-firstName").find("input").type("A");
    cy.getDataCy("signup-submit").click();
    cy.contains("First name must be at least 2 characters").should(
      "be.visible"
    );
    cy.getDataCy("signup-lastName").find("input").type("B");
    cy.getDataCy("signup-submit").click();
    cy.contains("Last name must be at least 2 characters").should("be.visible");
    cy.getDataCy("signup-password").find("input").type("pass");
    cy.getDataCy("signup-submit").click();
    cy.contains("Password must be at least 6 characters").should("be.visible");
    // password match error
    cy.getDataCy("signup-password").find("input").clear();
    cy.getDataCy("signup-password").find("input").type("password123");
    cy.getDataCy("signup-confirm-password").find("input").clear();
    cy.getDataCy("signup-confirm-password").find("input").type("password");
    cy.getDataCy("signup-submit").click();
    cy.contains("Passwords do not match").should("be.visible");

    // email errors
    cy.getDataCy("signup-email").find("input").type("invalidemail");
    cy.getDataCy("signup-submit").click();
    cy.contains("Invalid email address").should("be.visible");

    const invalidDomains = [
      "user@invalid.com",
      "user@wrong.org",
      "user@fake.net",
    ];
    invalidDomains.forEach((email) => {
      cy.getDataCy("signup-email").find("input").clear();
      cy.getDataCy("signup-email").find("input").type(email);
      cy.getDataCy("signup-submit").click();
      cy.contains("Please use a valid email").should("be.visible");
    });
    const restrictedWords = ["admin", "test"];
    restrictedWords.forEach((word) => {
      cy.getDataCy("signup-email").find("input").clear();
      cy.getDataCy("signup-email").find("input").type(`${word}@gmail.com`);
      cy.getDataCy("signup-submit").click();
      cy.contains(`Email cannot contain word "${word}"`).should("be.visible");
    });
  });
  it("should error for an invalid email or password ", () => {
    cy.visit("/login");
    cy.location("pathname").should("equal", "/login");
    cy.getDataCy("login-email").find("input").type("cypress@gmail.com");
    cy.getDataCy("login-password").find("input").type("password2");
    cy.getDataCy("login-submit").click();
    cy.wait("@login").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(401);
      expect(intercept.response.body.message).to.equal(
        "Invalid Email or Password"
      );
    });
    cy.get('[role="status"]')
      .should("be.visible")
      .and("have.text", "Invalid Email or Password");
  });
  it("should error if email is already in use ", () => {
    cy.visit("/signup");
    cy.location("pathname").should("equal", "/signup");
    cy.getDataCy("signup-firstName").find("input").type("Cypress");
    cy.getDataCy("signup-lastName").find("input").type("Tester");
    cy.getDataCy("signup-email").find("input").type("cypress@gmail.com");
    cy.getDataCy("signup-password").find("input").type("password123");
    cy.getDataCy("signup-confirm-password").find("input").type("password123");
    cy.getDataCy("signup-submit").click();
    cy.wait("@signup").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(400);
      expect(intercept.response.body.message).to.equal("User already exists");
    });
    cy.get('[role="status"]')
      .should("be.visible")
      .and("have.text", "User already exists");
  });
});
