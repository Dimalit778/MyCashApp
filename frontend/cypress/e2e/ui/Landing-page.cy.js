describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the top navbar', () => {
    cy.getDataCy('top-bar').should('be.visible');
    cy.getDataCy('top-bar').within(() => {
      cy.getDataCy('app-logo-link-to-home').should('be.visible');
      cy.getDataCy('signup-link').should('be.visible');
      cy.getDataCy('login-link').should('be.visible');
    });
  });
  it('should display landing page elements', () => {
    cy.getDataCy('landing-title').should('contain', 'MANAGE YOUR');
    cy.getDataCy('stroke-title').should('contain', 'MONEY');

    // Scroll to about section first to trigger animation
    cy.getDataCy('about-title').scrollIntoView().should('contain', 'About Us');

    // Now check image visibility after animation is triggered
    cy.getDataCy('team-image').should('have.attr', 'alt', 'Team').and('be.visible');

    cy.getDataCy('about-text-1').should('exist');
    cy.getDataCy('about-text-2').should('exist');
  });
  it('should display the footer', () => {
    // Scroll to footer before checking visibility
    cy.getDataCy('footer').scrollIntoView().should('be.visible');
    cy.getDataCy('footer-info').within(() => {
      cy.get('h5')
        .should('be.visible')
        .invoke('text')
        .should('match', /contact information/i);
      cy.get('p')
        .should('be.visible')
        .invoke('text')
        .should('match', /israel, tel aviv/i);
      cy.get('p')
        .should('be.visible')
        .invoke('text')
        .should('match', /email: dimalit778@gmail.com/i);
      cy.get('p')
        .should('be.visible')
        .invoke('text')
        .should('match', /phone: \+925 526731280/i);
    });
    cy.getDataCy('footer-social').within(() => {
      cy.get('h5').should('contain', 'Follow Us');
      cy.getDataCy('facebook-link')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.facebook.com/dima.litvinov1');
      cy.getDataCy('instagram-link')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.instagram.com/dima1litvinov/');
      cy.getDataCy('youtube-link').should('be.visible').and('have.attr', 'href', 'https://www.youtube.com/');
    });
    cy.getDataCy('footer-divider').should('be.visible');
    cy.getDataCy('footer-copyright')
      .should('be.visible')
      .invoke('text')
      .should('match', /all rights reserved/i);
  });
});
