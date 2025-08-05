Cypress.Commands.add('fazerLoginComCredenciaisValidas', () => {   
    cy.fixture('credenciais').then((credenciais) => {
        cy.get('#email').click().type(credenciais.valida.usuario)
        cy.get('#password').click().type(credenciais.valida.senha)
        cy.contains('button', 'LOGIN').click()
      })
    })

Cypress.Commands.add('fazerLoginComCredenciaisInvalidas', () => {
    cy.fixture('credenciais').then((credenciais) => {
        cy.get('#email').click().type(credenciais.invalida1.usuario)
        cy.get('#password').click().type(credenciais.invalida1.senha)
        cy.contains('button', 'LOGIN').click()
  })

})
Cypress.Commands.add('fazerLoginComCredenciaisInvalidas2', () => {
    cy.fixture('credenciais').then((credenciais) => {
        cy.get('#email').clear().type(credenciais.invalida2.usuario)
        cy.get('#password').clear().type(credenciais.invalida2.senha)
        cy.contains('button', 'LOGIN').click()
})


})