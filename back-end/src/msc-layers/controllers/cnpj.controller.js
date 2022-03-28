const rescue = require('express-rescue');

const { CREATED, OK_STATUS } = require('../../utils/http_code_status');
const {
  registerCnpjService, editCnpjService, removeCnpjService,
} = require('../services/cnpj.service');

const registerCnpjController = rescue(async (req, res) => {
  const { cnpj, blockListed } = req.body;

  const registeredCnpj = await registerCnpjService({ cnpj, blockListed });
  return res.status(CREATED).json(registeredCnpj);
});

const editCnpjController = rescue(async (req, res) => {
  const { params: { cnpj }, body: { blockListed } } = req;

  const editedCnpj = await editCnpjService(cnpj, blockListed);
  return res.status(OK_STATUS).json(editedCnpj);
});

const removeCnpjController = rescue(async (req, res) => {
  const { cnpj } = req.params;
  await removeCnpjService(cnpj);

  return res.status(OK_STATUS).json({ message: 'CNPJ removido com sucesso' });
});

module.exports = {
  registerCnpjController,
  editCnpjController,
  removeCnpjController,
};
