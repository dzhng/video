describe('sign out', () => {
  it('will logout the user', () => {
    cy.visit('/');
    cy.get('[data-testid=user-profile-icon]').first().click();
    cy.get('[data-testid=logout-option]').click();
    cy.wait(10000);
    cy.url().should('contain', Cypress.config().baseUrl + '/login');
  });

  it('will attempt to go to home', () => {
    cy.visit('/');
    cy.url().should('contain', Cypress.config().baseUrl + '/login');
  });
});
