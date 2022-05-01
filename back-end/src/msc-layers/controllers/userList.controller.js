const rescue = require('express-rescue');

const { CREATED, OK_STATUS } = require('../../utils/http_code_status');
const {
  registerUsernameService,
  registerEmailService,
  editUserStatusService,
  removeUserService,
  getAllUsersService,
} = require('../services/userList.service');

const registerUsernameController = rescue(async (req, res) => {
  const { user, blockListed } = req.body;

  const registeredUsername = await registerUsernameService({ user, blockListed });
  return res.status(CREATED).json(registeredUsername);
});

const registerEmailController = rescue(async (req, res) => {
  const { user, blockListed } = req.body;

  const registeredEmail = await registerEmailService({ user, blockListed });
  return res.status(CREATED).json(registeredEmail);
});

const editUserStatusController = rescue(async (req, res) => {
  const { params: { id }, body: { blockListed } } = req;

  const editedUser = await editUserStatusService(id, blockListed);
  return res.status(OK_STATUS).json(editedUser);
});

const removeUserController = rescue(async (req, res) => {
  const { id } = req.params;
  await removeUserService(id);

  return res.status(OK_STATUS).json({ message: 'Usuário removido com sucesso' });
});

const getAllUsersController = rescue(async (_req, res) => {
  const allUsers = await getAllUsersService();

  return res.status(OK_STATUS).json(allUsers);
});

module.exports = {
  registerUsernameController,
  registerEmailController,
  editUserStatusController,
  removeUserController,
  getAllUsersController,
};
