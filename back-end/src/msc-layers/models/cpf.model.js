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

const editCpfModel = async (cpfToEdit, blockListedStatus) => {
  const db = await connection();
  const { value } = await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { cpf: cpfToEdit },
    { $set: { blockListed: blockListedStatus } },
    { returnDocument: 'after' },
  );

  return value;
};

const removeCpfModel = async (cpfToRemove) => {
  const db = await connection();
  const { deletedCount } = await db.collection(COLLECTION_NAME)
    .deleteOne({ cpf: cpfToRemove });

  return deletedCount;
};

const getAllCpfModel = async () => {
  const db = await connection();
  const cpfArray = await db.collection(COLLECTION_NAME)
    .find().toArray();

  return cpfArray;
};

const insertManyCpfModel = async (toInsert) => {
  const db = await connection();
  await db.collection(COLLECTION_NAME).insertMany(toInsert);
};

module.exports = {
  registerCpfModel,
  getCpfByCpfModel,
  editCpfModel,
  removeCpfModel,
  getAllCpfModel,
  insertManyCpfModel,
};
