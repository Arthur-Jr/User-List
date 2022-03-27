const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const { expect } = chai;

const { getConnection } = require('./mongoMockConnection');
const server = require('../api/app');
const {
  CREATED, BAD_REQUEST, OK_STATUS, CONFLICT, NOT_FOUND, NO_CONTENT
} = require('../utils/http_code_status');

chai.use(chaiHttp);

const DB_NAME = 'cpf-cnpj-list';
const DB_COLLECTION = 'cpfs';
const CPF_EXAMPLE = '64122484553';
const INVALID_CPF_EXAMPLE = '27690613567';

describe('Testes dos end-points relacionados ao CPF', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    sinon.stub(console, 'log');
  });

  after(async () => {
    await connectionMock.db(DB_NAME).collection(DB_COLLECTION).deleteMany({});
    await connectionMock.db(DB_NAME).collection(DB_COLLECTION).drop();
    MongoClient.connect.restore();
    console.log.restore();
  });

  describe('Testes de inclusão de CPF:', () => {
    let response;

    const registerCpf = async (cpf) => {
      response = await chai.request(server)
      .post('/cpf')
      .send({ cpf, blockListed: false });
    }

    describe('Quando é registrado com sucesso:', () => {
      before(async () => await registerCpf(CPF_EXAMPLE));

      it('Deve retornar o código de status 201', () => {
        expect(response).to.have.status(CREATED);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "id', () => {
        expect(response.body).to.have.property('id');
      });

      it(`O CPF:${CPF_EXAMPLE} deve está registrado no banco.`, async () => {
        const { cpf: insertedCpf } = await connectionMock.db(DB_NAME)
        .collection(DB_COLLECTION).findOne({ cpf: CPF_EXAMPLE });

        expect(insertedCpf).to.be.equal(CPF_EXAMPLE);
      });
    });

    describe('Quando o CPF é inválido:', () => {
      before(async () => await registerCpf(INVALID_CPF_EXAMPLE));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF inválido"', () => {
        expect(response.body.message).to.be.equal('CPF inválido');
      });
    });

    describe('Quando o CPF já está registrado:', () => {
      before(async () => await registerCpf(CPF_EXAMPLE));

      it('Deve retornar o código de status 409', () => {
        expect(response).to.have.status(CONFLICT);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF Já registrado"', () => {
        expect(response.body.message).to.be.equal('CPF Já registrado');
      });
    });
  });

  describe('Testes de edição de CPF:', () => {
    let response;

    const editCpf = async (cpf, body) => {
      response = await chai.request(server)
      .put(`/cpf/${cpf}`)
      .send(body);
    }

    describe('Quando a edição é feita com sucesso:', () => {
      before(async () => await editCpf(CPF_EXAMPLE, { blockListed: true }));

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

    describe('Quando o CPF é inválido:', () => {
      before(async () => await editCpf(INVALID_CPF_EXAMPLE, { blockListed: true }));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF inválido"', () => {
        expect(response.body.message).to.be.equal('CPF inválido');
      });
    });

    describe('Quando o CPF não existe:', () => {
      before(async () => await editCpf('78263704006', { blockListed: true }));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF não encontrado"', () => {
        expect(response.body.message).to.be.equal('CPF não encontrado');
      });
    });
  });

  describe('Testes de remoção de CPF:', () => {
    let response;

    const removeCpf = async (cpf) => {
      response = await chai.request(server)
      .delete(`/cpf/${cpf}`);
    }

    describe('Quando é removido com sucesso:', () => {
      before(async () => await removeCpf(CPF_EXAMPLE));

      it('Deve retornar o código de status 200', () => {
        expect(response).to.have.status(OK_STATUS);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF removido com sucesso"', () => {
        expect(response.body.message).to.be.equal('CPF removido com sucesso');
      });
    });

    describe('Quando o CPF não existe:', () => {
      before(async () => await removeCpf(CPF_EXAMPLE));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CPF não encontrado"', () => {
        expect(response.body.message).to.be.equal('CPF não encontrado');
      });
    });
  });
});
