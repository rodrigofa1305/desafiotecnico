import { faker } from '@faker-js/faker';

let userId
let authToken
let userData
let updatedUserData

describe('Desafio Tecnico', () => {

  before(() => {
    // Geração de dados aleatórios para usuários 
    userData = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true"
    }

    updatedUserData = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "false"
    }

    // Criando o usuário e armazenando o USERID
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: userData
    }).then((response) => {
      expect(response.status).to.equal(201)
      userId = response.body._id

      // Salva variáveis de ambiente para serem acessadas em outros arquivos
      Cypress.env('userId', userId)
      Cypress.env('userEmail', userData.email)
      Cypress.env('userPassword', userData.password)
    })
  })

  context('Cenários de Login', () => {
    it('Deve realizar o login com Sucesso', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: Cypress.env('userEmail'),
          password: Cypress.env('userPassword')
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')

        // Salva o token para ser usado pelo usuario.cy.js
        authToken = response.body.authorization
        Cypress.env('authToken', authToken)
        Cypress.env('authToken', response.body.authorization)
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
  context('Cenarios de Usuario', () => {

    it('Deve listar todos os usuários cadastrados', () => {
      cy.request({
        method: 'GET',
        url: '/usuarios'
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.usuarios).to.be.an('array');
        cy.log(`Lista de usuários validada. Quantidade: ${response.body.quantidade}`);
      })
    })

    it('Deve buscar o usuário específico pelo ID', () => {
      cy.request({
        method: 'GET',
        url: `/usuarios/${userId}`
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body._id).to.equal(userId);
        cy.log(`Busca por ID bem-sucedida. Usuário: ${response.body.nome}`);
      })
    })

    it('Deve buscar o usuário não existente', () => {
      cy.request({
        method: 'GET',
        url: `/usuarios/69542684lufdsarh`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Usuário não encontrado')
      })
    })

    it('Deve atualizar um usuário com sucesso', () => {
      cy.request({
        method: 'PUT',
        url: `/usuarios/${userId}`,
        headers: {
          Authorization: authToken
        },
        body: updatedUserData
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })

    it('Deve excluir um usuário com sucesso', () => {
      cy.request({
        method: 'DELETE',
        url: `/usuarios/${userId}`,
        headers: {
          Authorization: authToken
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })

    it('Deve tentar excluir um usuário não existente', () => {
      cy.request({
        method: 'DELETE',
        url: `/usuarios/dlv93udls0yel82`,
        headers: {
          Authorization: authToken
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Nenhum registro excluído')
      })
    })

    it('Deve validar que não é um administrador excluir um usuário com sucesso', () => {
      cy.request({
        method: 'DELETE',
        url: `/usuarios/${newUserId}`,
                headers: {
          Authorization: authToken
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })

  })
})
