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

const DB_NAME = 'cpf/cnpj-validation';
const DB_COLLECTION = 'cpnjs';
const CNPJ_EXAMPLE = '51855572000193';

describe('Testes dos end-points relacionados ao CNPJ', () => {
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

  describe('Testes de inclusão de CNPJ:', () => {
    let response;

    const registerCnpj = async (cnpj) => {
      response = await chai.request(server)
      .post('/cnpj')
      .send({ cnpj });
    }

    describe('Quando é registrado com sucesso:', () => {
      before(async () => await registerCnpj(CNPJ_EXAMPLE));

      it('Deve retornar o código de status 201', () => {
        expect(response).to.have.status(CREATED);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "cnpj"', () => {
        expect(response.body).to.have.property('cnpj');
      });

      it(`A propriedade "cnpj" deve ser igual a ${CNPJ_EXAMPLE}`, () => {
        expect(response.body.cnpj).to.be.equal(CNPJ_EXAMPLE);
      });
    });

    describe('Quando o CNPJ é inválido:', () => {
      before(async () => await registerCnpj('4444'));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CNPJ inválido"', () => {
        expect(response.body.message).to.be.equal('CNPJ inválido');
      });
    });

    describe('Quando o CPF já está registrado:', () => {
      before(async () => await registerCnpj(CNPJ_EXAMPLE));

      it('Deve retornar o código de status 409', () => {
        expect(response).to.have.status(CONFLICT);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CNPJ Já registrado"', () => {
        expect(response.body.message).to.be.equal('CNPJ Já registrado');
      });
    });
  });

  describe('Testes de edição de CNPJ:', () => {
    let response;

    const editCnpj = async (cnpj, body) => {
      response = await chai.request(server)
      .put(`/cnpj/${cnpj}`)
      .send(body);
    }

    describe('Quando a edição é feita com sucesso:', () => {
      before(async () => await editCnpj(CNPJ_EXAMPLE, { blockListed: true }));

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

    describe('Quando o CNPJ é inválido:', () => {
      before(async () => await editCnpj(CNPJ_EXAMPLE, { cnpj: '444' }));

      it('Deve retornar o código de status 400', () => {
        expect(response).to.have.status(BAD_REQUEST);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CNPJ inválido"', () => {
        expect(response.body.message).to.be.equal('CNPJ inválido');
      });
    });

    describe('Quando o CNPJ não existe:', () => {
      before(async () => await editCnpj('51855572000120', { blockListed: true }));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CNPJ não encontrado"', () => {
        expect(response.body.message).to.be.equal('CNPJ não encontrado');
      });
    });
  });

  describe('Testes de remoção de CNPJ:', () => {
    let response;

    const removeCnpj = async (cnpj) => {
      response = await chai.request(server)
      .delete(`/cnpj/${cnpj}`);
    }

    describe('Quando é removido com sucesso:', () => {
      before(async () => await removeCnpj(CNPJ_EXAMPLE));

      it('Deve retornar o código de status 204', () => {
        expect(response).to.have.status(NO_CONTENT);
      });
    });

    describe('Quando o CNPJ não existe:', () => {
      before(async () => await removeCnpj('51855572000120'));

      it('Deve retornar o código de status 404', () => {
        expect(response).to.have.status(NOT_FOUND);
      });

      it('Deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });

      it('Deve possuir a propriedade "message"', () => {
        expect(response.body).to.have.property('message');
      });

      it('A propriedade "message" deve ser igual a "CNPJ não encontrado"', () => {
        expect(response.body.message).to.be.equal('CNPJ não encontrado');
      });
    });
  });
});
