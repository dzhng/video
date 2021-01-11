describe('sign in test', () => {
  it('will check if page is redirect to login screen if user is not signed in', () => {
    cy.visit('/');
    cy.url().should('equal', Cypress.config().baseUrl + '/login');
  });
  it('will sign in to google and redirect to home if successful', () => {
    cy.visit('/login');
    cy.get('#loginButton').click();
  });
});
