describe('Workspace Test', () => {
  it('will create a test workspace', () => {
    cy.visit('/');
    cy.get('[data-cy=workspaceListMenu]').select('[data-cy=newWorkspaceOption]');
  });

  it('will delete a workspace', () => {
    cy.visit('/');
    cy.get('[data-cy=workspaceSettingsButton]').click();
    cy.get('[data-cy=deleteWorkspaceButton]').click();
    cy.get('[data-cy=delete-button]').click();
  });
});
