const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const { BAD_REQUEST, CONFLICT, NOT_FOUND } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const errorMessage = require('../../utils/errorMessages');
const {
  registerCpfModel,
  getCpfByCpfModel,
  editCpfModel,
  removeCpfModel,
  getAllCpfModel,
} = require('../models/cpf.model');

const checkCpfValidations = (cpf) => {
  const cpfSchema = joi.document().cpf();
  const { error } = cpfSchema.validate(cpf);
  if (error) errorThrow(BAD_REQUEST, `CPF ${errorMessage.invalid}`);
};

const checkCpfDuplicity = async (cpf) => {
  const checkResult = await getCpfByCpfModel(cpf);
  if (checkResult) errorThrow(CONFLICT, `CPF ${errorMessage.alreadyExists}`);
};

const registerCpfService = async ({ cpf, blockListed }) => {
  checkCpfValidations(cpf);
  await checkCpfDuplicity(cpf);

  const id = await registerCpfModel({ cpf, blockListed });
  return { id };
};

const editCpfService = async (cpfToEdit, blockListedStatus) => {
  checkCpfValidations(cpfToEdit);

  const editedCpf = await editCpfModel(cpfToEdit, blockListedStatus);

  if (editedCpf === null) errorThrow(NOT_FOUND, `CPF ${errorMessage.notFound}`);
  return editedCpf;
};

const removeCpfService = async (cpfToRemove) => {
  checkCpfValidations(cpfToRemove);
  const deletedCount = await removeCpfModel(cpfToRemove);

  if (deletedCount === 0) errorThrow(NOT_FOUND, `CPF ${errorMessage.notFound}`);
};

const getAllCpfService = async () => getAllCpfModel();

module.exports = {
  registerCpfService,
  editCpfService,
  removeCpfService,
  getAllCpfService,
};
