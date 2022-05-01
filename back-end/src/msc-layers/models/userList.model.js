const connection = require('./connection');

const COLLECTION_NAME = 'userList';

const registerUserModel = async (newUser) => {
  const db = await connection();
  const { insertedId } = await db.collection(COLLECTION_NAME).insertOne(newUser);
  return insertedId;
};

const getUserModel = async (userToFind) => {
  const db = await connection();
  const user = await db.collection(COLLECTION_NAME).findOne({ user: userToFind });
  return user;
};

const editUserModel = async (userToEdit, blockListedStatus) => {
  const db = await connection();
  const { value } = await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { user: userToEdit },
    { $set: { blockListed: blockListedStatus } },
    { returnDocument: 'after' },
  );

  return value;
};

const removeUserModel = async (userToRemove) => {
  const db = await connection();
  const { deletedCount } = await db.collection(COLLECTION_NAME)
    .deleteOne({ user: userToRemove });

  return deletedCount;
};

const getAllUsersModel = async () => {
  const db = await connection();
  const usersArray = await db.collection(COLLECTION_NAME)
    .find().toArray();

  return usersArray;
};

const insertManyUsersModel = async (toInsert) => {
  const db = await connection();
  await db.collection(COLLECTION_NAME).insertMany(toInsert);
};

module.exports = {
  registerUserModel,
  getUserModel,
  editUserModel,
  removeUserModel,
  getAllUsersModel,
  insertManyUsersModel,
};
