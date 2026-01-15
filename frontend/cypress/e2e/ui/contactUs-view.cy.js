describe('Contact Page', () => {
  before(() => {
    cy.task('db:clear-db');
    cy.task('db:seed-user');
  });
  beforeEach(() => {
    cy.loginTestUser();
    cy.visit('/contact');
    cy.url().should('include', '/contact');
  });

  it('should display Header section', () => {
    cy.getDataCy('contact-title').within(() => {
      cy.get('h1').should('be.visible').and('contain', 'Get In Touch');
      cy.get('p').should('be.visible').and('contain', 'Our support team can help you with every question you have.');
      cy.get('p').should('be.visible').and('contain', 'You can contact us and our team will respond within 24 hours.');
    });
  });
  it('should display Contact info', () => {
    cy.getDataCy('contact-info').within(() => {
      cy.get('h1').should('be.visible').and('contain', 'Contact Us');
      cy.get('p').should('contain', 'Email: Mycash@outlook.com');
      cy.get('p').should('contain', 'Phone: +972 052-6731280');
    });
  });

  it('should display Form Fields', () => {
    cy.getDataCy('contact-name')
      .contains(/name/i)
      .parent()
      .find('input')
      .should('have.attr', 'placeholder')
      .and('match', /enter your name/i);

    cy.getDataCy('contact-email')
      .contains(/email/i)
      .parent()
      .find('input')
      .should('have.attr', 'placeholder')
      .and('match', /enter your email address/i);

    cy.getDataCy('contact-message')
      .contains(/message/i)
      .parent()
      .find('textarea')
      .should('have.attr', 'placeholder')
      .and('match', /write your message.../i);

    cy.getDataCy('contact-submit-button').contains('Send');
  });
  it('should show validation errors for empty fields', () => {
    cy.getDataCy('contact-submit-button').click();

    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Message is required').should('be.visible');
  });

  it('should show validation errors for invalid emails', () => {
    cy.getDataCy('contact-name').find('input').as('nameInput');
    cy.getDataCy('contact-email').find('input').as('emailInput');
    cy.getDataCy('contact-message').find('textarea').as('messageInput');

    const invalidEmails = ['invalid', 'invalid@', 'invalid@test', '@test.com'];

    invalidEmails.forEach((email) => {
      cy.get('@emailInput').clear();
      cy.get('@emailInput').type(email);

      cy.getDataCy('contact-submit-button').click();
      cy.contains('Invalid email address').should('be.visible');
    });

    cy.get('@emailInput').clear();
    cy.get('@emailInput').type('example@gmail.com');

    cy.getDataCy('contact-submit-button').click();
    cy.contains('Invalid email address').should('not.exist');
  });

  it('should clear validation error messages when typing', () => {
    cy.getDataCy('contact-submit-button').click();

    cy.getDataCy('contact-name').find('input').type('Test');
    cy.contains('Name is required').should('not.exist');

    cy.getDataCy('contact-email').find('input').type('test@gmail.com');
    cy.contains('Email is required').should('not.exist');

    cy.getDataCy('contact-message').find('textarea').type('Test message');
    cy.contains('Message is required').should('not.exist');
  });
  it('should handle successful form submission and reset the form', () => {
    cy.getDataCy('contact-name').find('input').type('Test User');
    cy.getDataCy('contact-email').find('input').type('test@gmail.com');
    cy.getDataCy('contact-message').find('textarea').type('This is a test message');

    cy.getDataCy('contact-submit-button').click();

    cy.contains('Message sent successfully').should('be.visible');

    cy.getDataCy('contact-name')
      .find('input')
      .should('have.value', '')
      .should('have.attr', 'placeholder')
      .and('match', /enter your name/i);

    cy.getDataCy('contact-email')
      .find('input')
      .should('have.value', '')
      .should('have.attr', 'placeholder')
      .and('match', /enter your email address/i);

    cy.getDataCy('contact-message')
      .find('textarea')
      .should('have.value', '')
      .should('have.attr', 'placeholder')
      .and('match', /write your message.../i);
  });
});
