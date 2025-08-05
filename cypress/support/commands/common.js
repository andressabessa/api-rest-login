Cypress.Commands.add('verificarMensagemNoFrontend', mensagem => {
    cy.get('#frontendErrorMessage').should('have.text', mensagem)

})