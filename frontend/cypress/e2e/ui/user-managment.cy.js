describe('User Management ', () => {
  beforeEach(() => {
    cy.task('db:clear-db');
    cy.task('db:seed-user');
    cy.loginTestUser();
    cy.visit('/settings');
  });

  describe('Profile Image ', () => {
    beforeEach(() => {
      cy.intercept('PATCH', '**/api/users/imageActions').as('imageActions');
      cy.getDataCy('uploadImage-container').should('be.visible');
    });

    it('should bypass upload and test deletion', () => {
      cy.getDataCy('upload-image-button').should('be.visible').click();

      cy.getDataCy('upload-image-input').selectFile('cypress/fixtures/profileImage.jpg', { force: true });

      cy.get('img[alt="Preview"]').should('be.visible');

      cy.window().then((win) => {
        return new Cypress.Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            win.removeEventListener('fileReaderComplete', eventHandler);
            resolve();
          }, 5000);

          const eventHandler = () => {
            clearTimeout(timeoutId);
            resolve();
          };

          win.addEventListener('fileReaderComplete', eventHandler, { once: true });
        });
      });
      cy.getDataCy('save-image-button').should('be.visible');

      cy.get('button').contains('Save').click();

      cy.wait('@imageActions').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });

      cy.contains('Profile updated successfully').should('be.visible');

      // Delete image
      cy.getDataCy('delete-image-button').should('be.visible').click();

      cy.wait('@imageActions').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });

      cy.contains('Photo was deleted').should('be.visible');
    });
    it('Cancel image upload', () => {
      cy.getDataCy('upload-image-button').should('be.visible').click();
      cy.getDataCy('upload-image-input').selectFile('cypress/fixtures/profileImage.jpg', { force: true });

      cy.getDataCy('save-image-button').should('be.visible');
      cy.getDataCy('cancel-image-button').should('be.visible');

      cy.getDataCy('cancel-image-button').click();
      cy.getDataCy('cancel-image-button').should('not.exist');

      cy.get('img[alt="Preview"]').should('not.exist');
    });
  });

  describe('Edit Profile Management', () => {
    beforeEach(() => {
      cy.intercept('PATCH', '**/api/users/update').as('UpdateUser');
      cy.getDataCy('profile-edit-btn').click();
    });
    it('should show edit profile form initially in disabled state', () => {
      cy.visit('/settings');
      cy.getDataCy('edit-profile-container').should('be.visible');
      cy.getDataCy('first-name-input').find('input').should('be.visible').and('be.disabled');
      cy.getDataCy('last-name-input').find('input').should('be.visible').and('be.disabled');
      cy.getDataCy('edit-account-form').should('not.exist');
      cy.getDataCy('profile-edit-btn').should('be.visible');
    });
    it('should validate form fields', () => {
      // Test first name validation
      cy.getDataCy('first-name-input').clear();
      cy.getDataCy('error-message').should('be.visible').and('contain', 'First Name is required');

      // Test last name validation
      cy.getDataCy('last-name-input').clear();
      cy.getDataCy('error-message').should('be.visible').and('contain', 'Last Name is required');

      // Test input with valid data clears errors
      cy.getDataCy('first-name-input').type('Valid');
      cy.getDataCy('last-name-input').type('User');
      cy.getDataCy('error-message').should('not.exist');

      // Test missing new password
      cy.getDataCy('current-password-input').type('123456');
      cy.contains('button', 'Save Changes').click();

      cy.getDataCy('error-message').should('be.visible').and('contain', 'Please enter new password');

      // Test missing current password
      cy.getDataCy('current-password-input').find('input').clear();
      cy.getDataCy('new-password-input').type('123456');
      cy.contains('button', 'Save Changes').click();

      cy.getDataCy('error-message').should('be.visible').and('contain', 'Please enter current password');

      // Test password must be at least 6 characters
      cy.getDataCy('new-password-input').find('input').clear();
      cy.getDataCy('new-password-input').type('12345');
      cy.getDataCy('error-message').should('be.visible').and('contain', 'Password must be at least 6 characters');

      // Test passwords must be different
      cy.getDataCy('new-password-input').find('input').clear();
      cy.getDataCy('current-password-input').type('123456');
      cy.getDataCy('new-password-input').type('123456');
      cy.getDataCy('error-message')
        .should('be.visible')
        .and('contain', 'New password must be different from current password');
    });

    it('should cancel editing without saving changes', () => {
      cy.getDataCy('first-name-input')
        .find('input')
        .invoke('val')
        .then((originalFirstName) => {
          cy.getDataCy('last-name-input')
            .find('input')
            .invoke('val')
            .then((originalLastName) => {
              cy.getDataCy('first-name-input').find('input').clear();
              cy.getDataCy('first-name-input').type('CyUser');
              cy.getDataCy('last-name-input').find('input').clear();
              cy.getDataCy('last-name-input').type('TestUser');

              cy.getDataCy('profile-cancel-btn').click();

              cy.getDataCy('first-name-input').find('input').should('have.value', originalFirstName).and('be.disabled');
              cy.getDataCy('last-name-input').find('input').should('have.value', originalLastName).and('be.disabled');
            });
        });
    });
    it('should successfully save profile changes and display UI ', () => {
      cy.getDataCy('first-name-input').find('input').clear();
      cy.getDataCy('first-name-input').type('CyUser');
      cy.getDataCy('last-name-input').find('input').clear();
      cy.getDataCy('last-name-input').type('TestUser');

      cy.contains('button', 'Save Changes').click();

      cy.wait('@UpdateUser').then(({ response }) => {
        console.log(response);
        expect(response.statusCode).to.eq(200);
        cy.getDataCy('first-name-input').find('input').should('have.value', response.body.data.user.firstName);
        cy.getDataCy('last-name-input').find('input').should('have.value', response.body.data.user.lastName);
      });

      cy.contains('Profile updated successfully').should('be.visible');

      cy.getDataCy('first-name-input').find('input').should('be.disabled');
      cy.getDataCy('last-name-input').find('input').should('be.disabled');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('PATCH', '**/api/users/update', {
        statusCode: 500,
        body: { message: 'Server error occurred' },
      }).as('updateError');

      cy.getDataCy('first-name-input').find('input').clear();
      cy.getDataCy('first-name-input').type('CyUser');
      cy.getDataCy('last-name-input').find('input').clear();
      cy.getDataCy('last-name-input').type('TestUser');

      cy.contains('button', 'Save Changes').click();
      cy.wait('@updateError');

      cy.contains('Server error occurred').should('be.visible');

      cy.getDataCy('first-name-input').find('input').should('be.enabled');
    });
  });

  describe('Delete Account', () => {
    beforeEach(() => {
      cy.intercept('DELETE', '**/api/users/delete', {
        statusCode: 200,
        body: { message: 'User deleted successfully' },
      }).as('deleteUser');
      cy.intercept('POST', '**/api/auth/logout', {
        statusCode: 200,
        body: { message: 'Logged out successfully' },
      }).as('logout');
    });

    it('should show confirmation dialog', () => {
      cy.getDataCy('delete-account-btn').click();
      cy.get('.swal2-popup').should('be.visible');
      cy.get('.swal2-title').should('contain', 'Are you sure?');
      cy.get('.swal2-cancel').should('be.visible');
    });

    it('should handle account deletion', () => {
      // Mock deletion response
      cy.intercept('DELETE', '**/api/users/delete', {
        statusCode: 200,
        body: { message: 'Account deleted successfully' },
      }).as('deleteAccount');

      cy.getDataCy('delete-account-btn').click();
      cy.get('.swal2-confirm').click();

      // Verify redirection
      cy.url().should('include', '/login');
    });

    it('should handle deletion cancellation', () => {
      cy.getDataCy('delete-account-btn').click();
      cy.get('.swal2-cancel').click();
      cy.get('.swal2-popup').should('not.exist');
      cy.url().should('include', '/settings');
    });
  });
});
