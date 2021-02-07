describe('create workspace', () => {
  it('should not find any workspace', () => {
    cy.visit('/');
    cy.get('[data-testid=loader]').should('not.exist');
    cy.wait(10000);
    cy.get('[data-testid=no-workspace-container]').should('exist');
  });

  it('it should create a workspace', () => {
    cy.get('[data-testid=workspace-list-menu]').first().click();
    cy.get('[data-testid=new-workspace-option]').click();
    cy.get('[data-testid=new-workspace-name-field]').type('> Test Workspace <');
    cy.get('[data-testid=create-button').click();
    cy.get('[data-testid=loader]').should('exist');
    cy.get('[data-testid=no-workspace-container]').should('not.exist');
    cy.get('[data-testid=title]').should('contain', '> Test Workspace <');
    cy.get('[data-testid=workspace-list-menu]').should('contain', '> Test Workspace <');
  });

  it('should find the newly created workspace', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.get('[data-testid=no-workspace-container]').should('not.exist');
    cy.get('[data-testid=title]').should('contain', '> Test Workspace <');
    cy.get('[data-testid=workspace-list-menu]').should('contain', '> Test Workspace <');
  });

  // it('will reload home page should show loader then the workspace', () => {
  //   cy.visit('/');
  //   cy.get('[data-testid=loader]').should('exist');
  //   cy.wait(2000)
  //   cy.get('[data-testid=create-new-template-card]').should('contain', 'New template');
  //   cy.get('[data-testid=no-workspace-container]').should('not.exist');
  //   cy.get('[data-testid=title]').should('contain', '> Test Workspace <');
  //   cy.get('[data-testid=workspace-list-menu]').should('contain', '> Test Workspace <');
  // });
});
