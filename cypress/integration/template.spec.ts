describe('Room Test', () => {
  it('will create a new room', () => {
    cy.get('[data-testid=create-new-template-card]').click();
    cy.wait(10000);
    cy.get('[data-testid=template-name]').type('test template >-<');
    cy.get('[data-testid=create-button]').click();
    cy.wait(10000);
  });

  it('will create a new question', () => {
    cy.get('[data-testid=new-activity-button]').first().click();
    cy.get('[data-testid=activity-name]').contains('Questions').click();
    cy.get('[data-testid=question-text-field]')
      .contains('Enter the questions you want to ask')
      .type('How are you guys feeling today');
  });

  /*
  it('will create a new presentation', () => {

    cy.get('[data-testid=new-activity-button]').first().click();
    cy.get('[data-testid=activity-name]').contains('Presentation').click();
		cy.wait(5000)
		cy.get("[data-testid=upload-presentation-input]").attachFile("thisisalongnameforthesamplepresentation.pptx")
    // cy.get("[data-testid=upload-presentation-input]").click()
		cy.wait(60000);
  });
  */

  it('will start a video call', () => {
    cy.get('[data-testid=start-call-button]').click();
    cy.wait(10000);
    cy.get('[data-testid=start-join-call-button]').click();
    cy.wait(60000);
  });

  it('will end the current call', () => {
    cy.get('[data-testid=end-call-button]').click();
    cy.get('[data-testid=end-call-dialog-button]').click();
    cy.wait(10000);
  });

  // it('will create a new template and then delete it', () => {
  //   cy.visit('/');
  //   cy.get('[data-testid=create-new-template-card]').click();
  //   cy.wait(10000);
  //   cy.get('[data-testid=template-name]').type('test template >-<');
  //   cy.get('[data-testid=create-button]').click();
  //   cy.wait(10000);
  //   cy.get('[data-testid=template-settings-menu-button]').click();
  //   cy.get('[data-testid=delete-room-button]').click();
  //   cy.get('[data-testid=delete-button]').click();
  //   cy.url().should('equal', Cypress.config().baseUrl + '/');
  // });
});
