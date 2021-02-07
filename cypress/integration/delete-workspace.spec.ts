describe('delete workspace', () => {
  it('will delete a workspace', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.get('[data-testid=workspace-settings-button]').click();
    cy.get('[data-testid=delete-workspace-button]').click();
    cy.get('[data-testid=delete-button]').click();
  });
});
