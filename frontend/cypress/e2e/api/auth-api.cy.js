const authApi = `${Cypress.env("API_URL")}/api/auth`;

describe("Auth API", () => {
  before(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
  });
  it("should register a new user", () => {
    cy.request({
      method: "POST",
      url: `${authApi}/signup`,
      body: {
        firstName: "API",
        lastName: "Tester",
        email: "new-api@example.com",
        password: "Test1234",
        confirmPassword: "Test1234",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data).to.have.property("firstName", "API");
      expect(response.body.data).to.have.property("lastName", "Tester");
      expect(response.body.data).to.have.property(
        "email",
        "new-api@example.com"
      );
    });
  });
  it("should fail to register a user ", () => {
    cy.request({
      method: "POST",
      url: `${authApi}/signup`,
      body: {
        firstName: "API",
        lastName: "Tester",
        email: "cypress@gmail.com",
        password: "Test1234",
        confirmPassword: "Test1234",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("message", "User already exists");
    });
  });

  it("should login user successfully", () => {
    cy.request({
      method: "POST",
      url: `${authApi}/login`,
      body: {
        email: "cypress@gmail.com",
        password: "cypress123",
      },
    }).then((response) => {
      console.log("success login", response.body);
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("accessToken");
      expect(response.body.data).to.have.property("refreshToken");
      expect(response.body.data).to.have.property("user");
    });
  });

  it("should fail login user", () => {
    cy.request({
      method: "POST",
      url: `${authApi}/login`,
      body: {
        email: "fake@gmail.com",
        password: "144695",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property(
        "message",
        "Invalid Email or Password"
      );
    });
  });

  it("should logout successfully", () => {
    cy.request({
      method: "POST",
      url: `${authApi}/logout`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property(
        "message",
        "Logged out successfully"
      );
    });
  });
});
