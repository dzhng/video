describe('Template Tests', () => {
  it('will create a new template and then delete it', () => {
    cy.visit('/');
    cy.get('[data-testid=create-new-template-card]').click();
    cy.wait(10000);
    cy.get('[data-testid=template-name]').type('test template >-<');
    cy.get('[data-testid=create-button]').click();
    cy.wait(10000);
    cy.get('[data-testid=template-settings-menu-button]').click();
    cy.get('[data-testid=delete-room-button]').click();
    cy.get('[data-testid=delete-button]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
