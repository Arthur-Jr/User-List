const rescue = require('express-rescue');

const { CREATED } = require('../../utils/http_code_status');
const { registerCpfService } = require('../services/cpf.service');

const registerCpfController = rescue(async (req, res) => {
  const { cpf, blockListed } = req.body;

  const registeredCpf = await registerCpfService({ cpf, blockListed });
  return res.status(CREATED).json(registeredCpf);
});

module.exports = {
  registerCpfController,
};
