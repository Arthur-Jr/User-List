const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const { BAD_REQUEST, CONFLICT } = require('../../utils/http_code_status');
const errorThrow = require('../../utils/errorThrow');
const { registerCnpjModel, getCnpjByCnpjModel } = require('../models/cnpj.model');

const checkCnpjValidations = (cnpj) => {
  const cnpjSchema = joi.document().cnpj();
  const { error } = cnpjSchema.validate(cnpj);
  if (error) errorThrow(BAD_REQUEST, 'CNPJ inválido');
};

const checkCnpjDuplicity = async (cnpj) => {
  const checkResult = await getCnpjByCnpjModel(cnpj);
  if (checkResult) errorThrow(CONFLICT, 'CNPJ Já registrado');
};

const registerCnpjService = async ({ cnpj, blockListed }) => {
  checkCnpjValidations(cnpj);
  await checkCnpjDuplicity(cnpj);

  const id = await registerCnpjModel({ cnpj, blockListed });
  return { id };
};

module.exports = {
  registerCnpjService,
};
