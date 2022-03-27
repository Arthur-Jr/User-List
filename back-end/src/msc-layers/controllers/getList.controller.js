const rescue = require('express-rescue');

const { getAllCpfService } = require('../services/cpf.service');
const { getAllCnpjService } = require('../services/cnpj.service');
const { OK_STATUS } = require('../../utils/http_code_status');

const getAllCpfCnpjList = rescue(async (_req, res) => {
  const cpfArray = await getAllCpfService();
  const cnpjArray = await getAllCnpjService();

  res.status(OK_STATUS).json({ cpf: cpfArray, cnpj: cnpjArray });
});

module.exports = {
  getAllCpfCnpjList,
};
