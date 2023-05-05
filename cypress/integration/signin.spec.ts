describe('sign in test', () => {
  it('will redirect to login screen if user is not signed in', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.url().should('equal', Cypress.config().baseUrl + '/login');
  });

  it('will attempt to signin without credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid=sign-in-button]').click();
    cy.get('#email-helper-text').should('contain', 'email is a required field');
    cy.get('#password-helper-text').should('contain', 'password is a required field');
  });

  it('will attempt to sign in with invalid email format and password', () => {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('aad598@nyu');
    cy.get('[data-testid=password]').type('12345678');
    cy.get('[data-testid=sign-in-button]').click();
    cy.get('#email-helper-text').should('contain', 'email must be a valid email');
  });

  it('will attempt to sign in with a shorter password', () => {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('aad598@nyu.edu');
    cy.get('[data-testid=password]').type('12345');
    cy.get('[data-testid=sign-in-button]').click();
    cy.get('#password-helper-text').should('contain', 'password is too short');
  });

  it('will attempt to sign in with a longer password', () => {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('aad598@nyu.edu');
    cy.get('[data-testid=password]').type(
      'LQqYyfzTNH7RSz9z45iGbcyKUM64lUgmWx6F4T7Q2V4vZGl5HbXg7yRclmTn',
    );
    cy.get('[data-testid=sign-in-button]').click();
    cy.get('#password-helper-text').should('contain', 'password is too long');
  });
  it('will attempt to sign in with an credentials that do not exist', () => {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('ihopethis@doesnt.exist');
    cy.get('[data-testid=password]').type('justapassword');
    cy.get('[data-testid=sign-in-button]').click();
    cy.get('[data-testid=error-message]').should(
      'contain',
      'There is no user record corresponding to this identifier. ',
    );
  });

  it('will attempt to sign in with correct credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid=email]').type('aad598@nyu.edu');
    cy.get('[data-testid=password]').type('12345678');
    cy.get('[data-testid=sign-in-button]').click();
    cy.wait(10000);
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
