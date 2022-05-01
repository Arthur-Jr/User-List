const {
  insertManyUsersModel, getAllUsersModel,
} = require('../msc-layers/models/userList.model');

const userListMock = [
  { user: 'joazinho123', blockListed: false, type: 'username' },
  { user: 'xabalu02', blockListed: true, type: 'username' },
  { user: 'nameless', blockListed: false, type: 'username' },
  { user: 'user01', blockListed: true, type: 'username' },
  { user: 'user03', blockListed: false, type: 'username' },
  { user: 'xablau04', blockListed: true, type: 'username' },
  { user: 'email@email.com', blockListed: true, type: 'email' },
  { user: 'test@email.com', blockListed: false, type: 'email' },
  { user: 'xablau01@email.com', blockListed: true, type: 'email' },
  { user: 'email10@email.com', blockListed: false, type: 'email' },
  { user: 'xablau03@email.com', blockListed: true, type: 'email' },
];

const insertOnStart = async () => {
  const userList = await getAllUsersModel();

  if (userList.length === 0) {
    await insertManyUsersModel(userListMock);
  }
};

module.exports = insertOnStart;
