const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const { expect } = chai;

const { getConnection } = require('./mongoMockConnection');
const server = require('../api/app');
const {
  CREATED, BAD_REQUEST, OK_STATUS, CONFLICT, NOT_FOUND,
} = require('../utils/http_code_status');

chai.use(chaiHttp);

const DB_NAME = 'user-list';
const DB_COLLECTION = 'userList';
const USERNAME_EXAMPLE = 'test10';
const EMAIL_EXAMPLE = 'test10@email.com';


describe('Testes dos end-points relacionados a lista de usuários', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    sinon.stub(console, 'log');
  });

  after(async () => {
    await connectionMock.db(DB_NAME).collection(DB_COLLECTION).deleteMany({});
    MongoClient.connect.restore();
    console.log.restore();
  });

  describe('Testes de inclusão de um username:', () => {
    let response;

    const registerUser = async (username) => {
      response = await chai.request(server)
      .post('/user-list/username')
      .send({ user: username, blockListed: false });
    }

    describe('Quando é registrado com sucesso:', () => {
      before(async () => await registerUser(USERNAME_EXAMPLE));

      it('Deve retornar o código de status 201', () => {
        expect(response).to.have.status(CREATED);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "id', () => {
        expect(response.body).to.have.property('id');
      });

      it(`O usuário:${USERNAME_EXAMPLE} deve está registrado no banco.`, async () => {
        const { user } = await connectionMock.db(DB_NAME)
        .collection(DB_COLLECTION).findOne({ user: USERNAME_EXAMPLE });

        expect(user).to.be.equal(USERNAME_EXAMPLE);
      });
    });

    describe('Quando o Username é inválido:', () => {
      before(async () => await registerUser('ab'));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Username inválido"', () => {
        expect(response.body.message).to.be.equal('Username inválido');
      });
    });

    describe('Quando o username já está registrado:', () => {
      before(async () => await registerUser(USERNAME_EXAMPLE));

      it('Deve retornar o código de status 409', () => {
        expect(response).to.have.status(CONFLICT);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário já registrado"', () => {
        expect(response.body.message).to.be.equal('Usuário já registrado');
      });
    });
  });

  describe('Testes de inclusão de um email:', () => {
    let response;

    const registerUser = async (email) => {
      response = await chai.request(server)
      .post('/user-list/email')
      .send({ user: email, blockListed: false });
    }

    describe('Quando é registrado com sucesso:', () => {
      before(async () => await registerUser(EMAIL_EXAMPLE));

      it('Deve retornar o código de status 201', () => {
        expect(response).to.have.status(CREATED);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "id', () => {
        expect(response.body).to.have.property('id');
      });

      it(`O usuário:${EMAIL_EXAMPLE} deve está registrado no banco.`, async () => {
        const { user } = await connectionMock.db(DB_NAME)
        .collection(DB_COLLECTION).findOne({ user: EMAIL_EXAMPLE });

        expect(user).to.be.equal(EMAIL_EXAMPLE);
      });
    });

    describe('Quando o email é inválido:', () => {
      before(async () => await registerUser('email@'));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Email inválido"', () => {
        expect(response.body.message).to.be.equal('Email inválido');
      });
    });

    describe('Quando o email já está registrado:', () => {
      before(async () => await registerUser(EMAIL_EXAMPLE));

      it('Deve retornar o código de status 409', () => {
        expect(response).to.have.status(CONFLICT);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário já registrado"', () => {
        expect(response.body.message).to.be.equal('Usuário já registrado');
      });
    });
  });

  describe('Testes de edição de usuário:', () => {
    let response;

    const editUser = async (id, body) => {
      response = await chai.request(server)
      .put(`/user-list/${id}`)
      .send(body);
    }

    describe('Quando a edição é feita com sucesso:', () => {
      before(async () => await editUser(USERNAME_EXAMPLE, { blockListed: true }));

      it('Deve retornar o código de status 200', () => {
        expect(response).to.have.status(OK_STATUS);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "blockListed"', () => {
        expect(response.body).to.have.property('blockListed');
      });

      it('A propriedade "blockListed" deve ter valor "true"', () => {
        expect(response.body.blockListed).to.be.equal(true);
      });
    });

    describe('Quando o usuário é inválido:', () => {
      before(async () => await editUser('ab', { blockListed: true }));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário inválido"', () => {
        expect(response.body.message).to.be.equal('Usuário inválido');
      });
    });

    describe('Quando o usuário não existe:', () => {
      before(async () => await editUser('test1000', { blockListed: true }));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário não encontrado"', () => {
        expect(response.body.message).to.be.equal('Usuário não encontrado');
      });
    });
  });

  describe('Testes da consulta de Usuários', () => {
    const getLists = async () => {
      response = await chai.request(server).get('/user-list');
    }
  
    describe('Quando a consulta é feita com sucesso:', () => {
      before(async () => await getLists());
  
      it('Deve retornar o código de status 200', () => {
        expect(response).to.have.status(OK_STATUS);
      });
  
      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('array');
      });
  
      it('Deve possuir tamanho igual 2', () => {
        expect(response.body).to.have.length(2);
      });
    });
  });

  describe('Testes de remoção de usuário:', () => {
    let response;

    const removeUser = async (user) => {
      response = await chai.request(server)
      .delete(`/user-list/${user}`);
    }

    describe('Quando o email é removido com sucesso:', () => {
      before(async () => await removeUser(EMAIL_EXAMPLE));

      it('Deve retornar o código de status 200', () => {
        expect(response).to.have.status(OK_STATUS);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário removido com sucesso"', () => {
        expect(response.body.message).to.be.equal('Usuário removido com sucesso');
      });
    });

    describe('Quando o username é removido com sucesso:', () => {
      before(async () => await removeUser(USERNAME_EXAMPLE));

      it('Deve retornar o código de status 200', () => {
        expect(response).to.have.status(OK_STATUS);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário removido com sucesso"', () => {
        expect(response.body.message).to.be.equal('Usuário removido com sucesso');
      });
    });

    describe('Quando o usuário não existe:', () => {
      before(async () => await removeUser(USERNAME_EXAMPLE));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "Usuário não encontrado"', () => {
        expect(response.body.message).to.be.equal('Usuário não encontrado');
      });
    });
  });
});
