describe('Workspace Test', () => {
  it('will delete a workspace', () => {
    cy.visit('/');
    cy.get('#workspaceSettingsButton').click();
    cy.get('#deleteWorkspaceButton').click();
    cy.get('#deleteButton').click();
  });
});
