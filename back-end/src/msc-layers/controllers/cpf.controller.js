const rescue = require('express-rescue');

const { CREATED, OK_STATUS } = require('../../utils/http_code_status');
const {
  registerCpfService, editCpfService, removeCpfService,
} = require('../services/cpf.service');

const registerCpfController = rescue(async (req, res) => {
  const { cpf, blockListed } = req.body;

  const registeredCpf = await registerCpfService({ cpf, blockListed });
  return res.status(CREATED).json(registeredCpf);
});

const editCpfController = rescue(async (req, res) => {
  const { params: { cpf }, body: { blockListed } } = req;

  const editedCpf = await editCpfService(cpf, blockListed);
  return res.status(OK_STATUS).json(editedCpf);
});

const removeCpfController = rescue(async (req, res) => {
  const { cpf } = req.params;
  await removeCpfService(cpf);

  return res.status(OK_STATUS).json({ message: 'CPF removido com sucesso' });
});

module.exports = {
  registerCpfController,
  editCpfController,
  removeCpfController,
};
