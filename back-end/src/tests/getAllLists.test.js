const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const { expect } = chai;

const { getConnection } = require('./mongoMockConnection');
const server = require('../api/app');
const { OK_STATUS } = require('../utils/http_code_status');

chai.use(chaiHttp);

const DB_NAME = 'cpf-cnpj-list';
const DB_COLLECTION_1 = 'cpfs';
const DB_COLLECTION_2 = 'cnpjs';

describe('Testes da consulta de CPF e CNPJ', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    sinon.stub(console, 'log');
  });

  after(async () => {
    await connectionMock.db(DB_NAME).collection(DB_COLLECTION_1).deleteMany({});
    await connectionMock.db(DB_NAME).collection(DB_COLLECTION_2).deleteMany({});
    MongoClient.connect.restore();
    console.log.restore();
  });

  const getLists = async () => {
    response = await chai.request(server).get('/cpf-cnpj-lists');
  }

  describe('Quando a consulta é feita com sucesso:', () => {
    before(async () => await getLists());

    it('Deve retornar o código de status 200', () => {
      expect(response).to.have.status(OK_STATUS);
    });

    it('Deve retornar um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('Deve possuir a propriedade "cpf', () => {
      expect(response.body).to.have.property('cpf');
    });

    it('A propriedade "cpf" deve ser um array', () => {
      expect(response.body.cpf).to.be.a('array');
    });

    it('Deve possuir a propriedade "cnpj', () => {
      expect(response.body).to.have.property('cnpj');
    });

    it('A propriedade "cnpj" deve ser um array', () => {
      expect(response.body.cnpj).to.be.a('array');
    });
  });
});