describe('Desafio Tecnico', () => {


let authToken

  context('Cenários de Login', () => {

    it('Deve realizar o login com Sucesso', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: Cypress.env('email'),
          password: Cypress.env('password')
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')

        // Salva o token para ser usado pelo usuario
        authToken = response.body.authorization
        Cypress.env('authToken', authToken)
      })
    })

    it('Deve Realizar a validação de credenciais inválidas', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: 'email_invalido@gmail.com',
          password: 'senha_errada'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal('Email e/ou senha inválidos')
      })
    })
  })
})
