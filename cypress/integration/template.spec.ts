describe('Template Tests', () => {
  it('will attempt to create a new template without name', () => {
    cy.visit('/');
    cy.wait(10000);
    cy.get('#createNewTemplateCard').click();
    cy.wait(10000);
    cy.get('#createButton').click();
    cy.get('#templateName-helper-text').should('contain', 'required field');
  });

  it('will create a new template and then delete it', () => {
    cy.get('#templateName').type('test template >-<');
    cy.get('#createButton').click();
    cy.wait(10000);
    cy.get('#templateSettingsMenuButton').click();
    cy.get('#deleteTemplate').click();
    cy.get('#deleteButton').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
