const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const { BAD_REQUEST, CONFLICT, NOT_FOUND } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const {
  registerCpfModel, getCpfByCpfModel, editCpfModel,
} = require('../models/cpf.model');

const checkCpf = (cpf) => {
  const cpfSchema = joi.document().cpf();
  const { error } = cpfSchema.validate(cpf);
  if (error) errorThrow(BAD_REQUEST, 'CPF inválido');
};

const checkCpfDuplicity = async (cpf) => {
  const checkResult = await getCpfByCpfModel(cpf);
  if (checkResult) errorThrow(CONFLICT, 'CPF Já registrado');
};

const registerCpfService = async ({ cpf, blockListed }) => {
  checkCpf(cpf);
  await checkCpfDuplicity(cpf);

  const id = await registerCpfModel({ cpf, blockListed });
  return { id };
};

const editCpfService = async (cpfToEdit, blockListedStatus) => {
  checkCpf(cpfToEdit);

  const editedCpf = await editCpfModel(cpfToEdit, blockListedStatus);

  if (editedCpf === null) errorThrow(NOT_FOUND, 'CPF não encontrado');
  return editedCpf;
};

module.exports = {
  registerCpfService,
  editCpfService,
};
