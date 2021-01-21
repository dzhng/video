describe('Workspace Test', () => {
  it('will create a test workspace', () => {
    cy.visit('/');
    cy.get('[data-testid=workspace-list-menu]').select('[data-testid=newWorkspaceOption]');
  });

  it('will delete a workspace', () => {
    cy.visit('/');
    cy.get('[data-testid=workspace-settings-button]').click();
    cy.get('[data-testid=deleteWorkspaceButton]').click();
    cy.get('[data-testid=delete-button]').click();
  });
});
