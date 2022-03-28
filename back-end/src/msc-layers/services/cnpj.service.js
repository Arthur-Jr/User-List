const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const { BAD_REQUEST, CONFLICT, NOT_FOUND } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const errorMessage = require('../../utils/errorMessages');
const {
  registerCnpjModel,
  getCnpjByCnpjModel,
  editCnpjModel,
  removeCnpjModel,
  getAllCnpjModel,
} = require('../models/cnpj.model');

const checkCnpjValidations = (cnpj) => {
  const cnpjSchema = joi.document().cnpj();
  const { error } = cnpjSchema.validate(cnpj);
  if (error) errorThrow(BAD_REQUEST, `CNPJ ${errorMessage.invalid}`);
};

const checkCnpjDuplicity = async (cnpj) => {
  const checkResult = await getCnpjByCnpjModel(cnpj);
  if (checkResult) errorThrow(CONFLICT, `CNPJ ${errorMessage.alreadyExists}`);
};

const registerCnpjService = async ({ cnpj, blockListed }) => {
  checkCnpjValidations(cnpj);
  await checkCnpjDuplicity(cnpj);

  const id = await registerCnpjModel({ cnpj, blockListed });
  return { id };
};

const editCnpjService = async (cnpjToEdit, blockListedStatus) => {
  checkCnpjValidations(cnpjToEdit);

  const editedCnpj = await editCnpjModel(cnpjToEdit, blockListedStatus);

  if (editedCnpj === null) errorThrow(NOT_FOUND, `CNPJ ${errorMessage.notFound}`);
  return editedCnpj;
};

const removeCnpjService = async (cnpjToRemove) => {
  checkCnpjValidations(cnpjToRemove);
  const deletedCount = await removeCnpjModel(cnpjToRemove);

  if (deletedCount === 0) errorThrow(NOT_FOUND, `CNPJ ${errorMessage.notFound}`);
};

const getAllCnpjService = async () => getAllCnpjModel();

module.exports = {
  registerCnpjService,
  editCnpjService,
  removeCnpjService,
  getAllCnpjService,
};
