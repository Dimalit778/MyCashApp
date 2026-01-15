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

  it('should display Contact info card', () => {
    cy.getDataCy('contact-info').should('be.visible');
    
    cy.getDataCy('contact-info').within(() => {
      // Check title
      cy.get('h1').should('be.visible').and('contain', 'Contact Us');
      
      // Check email
      cy.get('p').should('contain', 'Email: Mycash@outlook.com');
      
      // Check phone
      cy.get('p').should('contain', 'Phone: +972 052-6731280');
      
      // Check footer message
      cy.get('p').should('contain', "We're here to help you manage your finances better");
    });
  });

  it('should display contact icons', () => {
    cy.getDataCy('contact-info').within(() => {
      // Check for FontAwesome icons (they render as SVG)
      cy.get('svg').should('have.length.at.least', 2);
    });
  });

  it('should have proper animations', () => {
    // Check that the contact card is visible (animation completed)
    cy.getDataCy('contact-info').should('be.visible');
    
    // Check that the header section is visible (animation completed)
    cy.getDataCy('contact-title').should('be.visible');
  });
});
