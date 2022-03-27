const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const { BAD_REQUEST, CONFLICT } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const { registerCpfModel, getCpfByCpfModel } = require('../models/cpf.model');

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

module.exports = {
  registerCpfService,
};
