const rescue = require('express-rescue');

const { CREATED } = require('../../utils/http_code_status');
const { registerCnpjService } = require('../services/cnpj.service');

const registerCnpjController = rescue(async (req, res) => {
  const { cnpj, blockListed } = req.body;

  const registeredCnpj = await registerCnpjService({ cnpj, blockListed });
  return res.status(CREATED).json(registeredCnpj);
});

module.exports = {
  registerCnpjController,
};
