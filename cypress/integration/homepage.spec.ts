describe('home page load', () => {
  it('will display either no workspaces or will display the templates', () => {
    cy.visit('/');
    cy.get('[data-testid=loader]').should('exist');
    cy.get('[data-testid=container]').contains('New template' || 'No Workspace');
    cy.get('[data-testid=loader]').should('not.exist');
  });
});
