const connection = require('./connection');

const COLLECTION_NAME = 'cpfs';

const registerCpfModel = async (newCpf) => {
  const db = await connection();
  const { insertedId } = await db.collection(COLLECTION_NAME).insertOne(newCpf);
  return insertedId;
};

const getCpfByCpfModel = async (cpfToFind) => {
  const db = await connection();
  const cpf = await db.collection(COLLECTION_NAME).findOne({ cpf: cpfToFind });
  return cpf;
};

module.exports = {
  registerCpfModel,
  getCpfByCpfModel,
};
