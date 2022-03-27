const connection = require('./connection');

const COLLECTION_NAME = 'cnpjs';

const registerCnpjModel = async (newCnpj) => {
  const db = await connection();
  const { insertedId } = await db.collection(COLLECTION_NAME).insertOne(newCnpj);
  return insertedId;
};

const getCnpjByCnpjModel = async (cnpjToFind) => {
  const db = await connection();
  const cnpj = await db.collection(COLLECTION_NAME).findOne({ cnpj: cnpjToFind });
  return cnpj;
};

module.exports = {
  registerCnpjModel,
  getCnpjByCnpjModel,
};
