const { CONFLICT, NOT_FOUND } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const errorMessage = require('../../utils/errorMessages');

const {
  checkUsernameToRegisterPayload,
  checkEmailToRegisterPayload,
  checkUserPayload,
} = require('./joiValidations/Validations');

const {
  registerUserModel,
  getUserModel,
  editUserModel,
  removeUserModel,
  getAllUsersModel,
} = require('../models/userList.model');

const checkUserDuplicity = async (id) => {
  const checkResult = await getUserModel(id);
  if (checkResult) errorThrow(CONFLICT, `Usuário ${errorMessage.alreadyExists}`);
};

const registerUsernameService = async ({ user, blockListed }) => {
  checkUsernameToRegisterPayload({ user, blockListed });
  await checkUserDuplicity(user);

  const id = await registerUserModel({ user, blockListed, type: 'username' });
  return { id };
};

const registerEmailService = async ({ user, blockListed }) => {
  checkEmailToRegisterPayload({ user, blockListed });
  await checkUserDuplicity(user);

  const id = await registerUserModel({ user, blockListed, type: 'email' });
  return { id };
};

const editUserStatusService = async (userToEdit, blockListedStatus) => {
  checkUserPayload(userToEdit);

  const editedUser = await editUserModel(userToEdit, blockListedStatus);

  if (editedUser === null) errorThrow(NOT_FOUND, `Usuário ${errorMessage.notFound}`);
  return editedUser;
};

const removeUserService = async (userToRemove) => {
  checkUserPayload(userToRemove);
  const deletedCount = await removeUserModel(userToRemove);

  if (deletedCount === 0) errorThrow(NOT_FOUND, `Usuário ${errorMessage.notFound}`);
};

const getAllUsersService = async () => getAllUsersModel();

module.exports = {
  registerUsernameService,
  registerEmailService,
  editUserStatusService,
  removeUserService,
  getAllUsersService,
};
