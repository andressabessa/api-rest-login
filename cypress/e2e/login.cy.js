describe('login', () => {
  beforeEach(() => {
    //Arrange
    cy.visit('http://localhost:4000')
  })

  it('Login com dados válidos devem permitir entrada no sistema', () => {     
    //Act
    cy.fazerLoginComCredenciaisValidas()
    //Assert
    cy.contains('h3', 'Bem-vindo(a)').should('be.visible')

  })


it('Login com dados inválidos não devem permitir entrada no sistema', () => {
   //Act
  cy.fazerLoginComCredenciaisInvalidas()
  //Assert
  cy.verificarMensagemNoFrontend('Email ou senha inválidos')
})

it('Bloquear o login após 3 tentativas inválidas', () => {
  //Act - 1º Tentativa
  cy.fazerLoginComCredenciaisInvalidas2()
 
   //Assert
   cy.verificarMensagemNoFrontend('Email ou senha inválidos. Tentativas restantes: 2')

    //Act - 2º Tentativa
    cy.fazerLoginComCredenciaisInvalidas2()
   
     //Assert
     cy.verificarMensagemNoFrontend('Email ou senha inválidos. Tentativas restantes: 1')

     //Act - 3º Tentativa
     cy.fazerLoginComCredenciaisInvalidas2()
   
     //Assert
     cy.get('#frontendErrorMessage').contains('Conta bloqueada por 15 minutos devido a múltiplas tentativas. Tente novamente em')

     //Act - 4º Tentativa
     cy.fazerLoginComCredenciaisInvalidas2()
  
     //Asser
     cy.get('#frontendErrorMessage').should('have.text', 'Conta bloqueada. Tente novamente em 14:59')

    })

     it('Acessar página de lembrar senha', () => {
  
      //Act
      cy.get('.forgot-link').click()
      
      // //Assert
      cy.get('.card-title').contains('Recuperar Senha').should('be.visible')
  
    })

})

