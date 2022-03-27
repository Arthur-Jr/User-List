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

const editCnpjModel = async (cnpjToEdit, blockListedStatus) => {
  const db = await connection();
  const { value } = await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { cnpj: cnpjToEdit },
    { $set: { blockListed: blockListedStatus } },
    { returnDocument: 'after' },
  );

  return value;
};

const removeCnpjModel = async (cnpjToRemove) => {
  const db = await connection();
  const { deletedCount } = await db.collection(COLLECTION_NAME)
    .deleteOne({ cnpj: cnpjToRemove });

  return deletedCount;
};

module.exports = {
  registerCnpjModel,
  getCnpjByCnpjModel,
  editCnpjModel,
  removeCnpjModel,
};
