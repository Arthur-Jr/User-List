const connection = require('./connection');

const COLLECTION_NAME = 'server-status';

const setServerStatusModel = async (date) => {
  const db = await connection();
  await db.collection(COLLECTION_NAME).deleteMany({});
  await db.collection(COLLECTION_NAME).insertOne({
    _id: 1,
    startDate: date,
    reqCount: 0,
  });
};

const incrementReqCountModel = async () => {
  const db = await connection();
  await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { _id: 1 },
    { $inc: { reqCount: 1 } },
  );
};

const getServerStatusModel = async () => {
  const db = await connection();
  const serverStatus = await db.collection(COLLECTION_NAME).findOne({ _id: 1 });

  return serverStatus;
};

module.exports = {
  setServerStatusModel,
  incrementReqCountModel,
  getServerStatusModel,
};
