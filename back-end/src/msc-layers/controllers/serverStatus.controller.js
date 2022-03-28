const rescue = require('express-rescue');

const { OK_STATUS } = require('../../utils/http_code_status');
const {
  setServerStatusService,
  getServerStatusService,
} = require('../services/serverStatus.service');

const setServerStatusController = async () => {
  await setServerStatusService(new Date());
};

const getServerStatusController = rescue(async (_req, res) => {
  const serverStatus = await getServerStatusService();

  return res.status(OK_STATUS).json(serverStatus);
});

module.exports = {
  setServerStatusController,
  getServerStatusController,
};
