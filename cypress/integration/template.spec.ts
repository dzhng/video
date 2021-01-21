describe('Template Tests', () => {
  it('will attempt to create a new template without name', () => {
    cy.visit('/');
    cy.wait(10000);
    cy.get('[data-testid=create-new-template-card]').click();
    cy.wait(10000);
    cy.get('[data-testid=create-button]').click();
    cy.get('#templateName-helper-text').should('contain', 'required field');
  });

  it('will create a new template and then delete it', () => {
    cy.get('#[data-testid=template-name]').type('test template >-<');
    cy.get('[data-testid=create-button]').click();
    cy.wait(10000);
    cy.get('[data-testid=template-settings-menu-button]').click();
    cy.get('[data-testid=delete-template]').click();
    cy.get('[data-testid=delete-button]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
