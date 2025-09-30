
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
    })

    context('Cenarios de Usuario', () => {
        it('Deve listar todos os usuários cadastrados', () => {
            cy.request({
                method: 'GET',
                url: '/usuarios'
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.usuarios).to.be.an('array');
            })
        })

        it('Cadastrar um usuário com sucesso', () => {
            cy.request({
                method: 'POST',
                url: '/usuarios',
                body: userData
            }).then((response) => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
                userId = response.body._id

                // Salva variáveis de ambiente para serem acessadas em outros testes
                Cypress.env('userId', userId)
                Cypress.env('userName', userData.nome)
                Cypress.env('userEmail', userData.email)
                Cypress.env('userPassword', userData.password)
            })
        })

        it('Validar Mensagem de E-mail já Existente', () => {
            cy.request({
                method: 'POST',
                url: '/usuarios',
                body: {
                    nome: faker.person.fullName(),
                    email: Cypress.env('email'),
                    password: faker.internet.password(),
                    administrador: "true"
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })
        })

        it('Deve buscar o usuário específico pelo ID', () => {
            cy.request({
                method: 'GET',
                url: `/usuarios/${userId}`
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body._id).to.equal(userId);
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

        it('Validar Mensagem de E-mail já Existente no Cenário de Alteração', () => {
            cy.request({
                method: 'PUT',
                url: `/usuarios/${userId}`,
                headers: {
                    Authorization: authToken
                },
                body: {
                    nome: Cypress.env('userName'),
                    email: Cypress.env('email'),
                    password: faker.internet.password(),
                    administrador: "false"
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })
        })

        it('Deve excluir um usuário com sucesso', () => {
            cy.request({
                method: 'DELETE',
                url: `/usuarios/${userId}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })

        it('Deve tentar excluir um usuário não existente', () => {
            cy.request({
                method: 'DELETE',
                url: `/usuarios/dlv93udls0yel82`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Nenhum registro excluído')
            })
        })
    })
})
